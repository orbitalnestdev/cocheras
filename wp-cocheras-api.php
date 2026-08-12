<?php
/**
 * Plugin Name: Cocheras API Extension
 * Description: Registra el CPT 'cochera' y expone el endpoint REST optimizado /wp-json/cocheras/v1/listings para el frontend Headless.
 * Version: 1.0.0
 * Author: Antigravity Team
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// 1. Registrar Custom Post Type 'cochera' si no existe
add_action('init', function () {
    if (post_type_exists('cochera')) {
        return;
    }

    $labels = [
        'name'               => 'Cocheras',
        'singular_name'      => 'Cochera',
        'menu_name'          => 'Cocheras',
        'add_new'            => 'Agregar Cochera',
        'add_new_item'       => 'Agregar Nueva Cochera',
        'edit_item'          => 'Editar Cochera',
        'new_item'           => 'Nueva Cochera',
        'view_item'          => 'Ver Cochera',
        'search_items'       => 'Buscar Cocheras',
        'not_found'          => 'No se encontraron cocheras',
        'not_found_in_trash' => 'No se encontraron cocheras en la papelera',
    ];

    $args = [
        'labels'              => $labels,
        'public'              => true,
        'has_archive'         => true,
        'publicly_queryable'  => true,
        'query_var'           => true,
        'rewrite'             => ['slug' => 'cocheras'],
        'capability_type'     => 'post',
        'hierarchical'        => false,
        'menu_position'       => 5,
        'menu_icon'           => 'dashicons-car',
        'supports'            => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
        'show_in_rest'        => true,
        'rest_base'           => 'cocheras',
    ];

    register_post_type('cochera', $args);

    // Registrar Taxonomía 'zona'
    register_taxonomy('zona', 'cochera', [
        'label'        => 'Zonas / Barrios',
        'rewrite'      => ['slug' => 'zona'],
        'hierarchical' => true,
        'show_in_rest' => true,
    ]);
});

// 2. Endpoint de API optimizado: GET /wp-json/cocheras/v1/listings
add_action('rest_api_init', function () {
    register_rest_route('cocheras/v1', '/listings', [
        'methods'             => 'GET',
        'callback'            => 'cocheras_get_listings',
        'permission_callback' => '__return_true',
        'args'                => [
            'per_page'  => ['default' => 24, 'sanitize_callback' => 'absint'],
            'page'      => ['default' => 1, 'sanitize_callback' => 'absint'],
            'zona'      => ['sanitize_callback' => 'sanitize_text_field'],
            'tipo'      => ['sanitize_callback' => 'sanitize_text_field'],
            'destacada' => ['sanitize_callback' => 'rest_sanitize_boolean'],
            'search'    => ['sanitize_callback' => 'sanitize_text_field'],
        ],
    ]);
});

function cocheras_get_listings(WP_REST_Request $request) {
    $per_page  = $request->get_param('per_page');
    $page      = $request->get_param('page');
    $zona      = $request->get_param('zona');
    $tipo      = $request->get_param('tipo');
    $destacada = $request->get_param('destacada');
    $search    = $request->get_param('search');

    $args = [
        'post_type'      => ['cochera', 'post'], // soporta CPT 'cochera' o posts estándar
        'post_status'    => 'publish',
        'posts_per_page' => $per_page,
        'paged'          => $page,
        's'              => $search,
    ];

    $meta_query = [];

    if (!empty($tipo)) {
        $meta_query[] = [
            'key'     => 'tipo',
            'value'   => $tipo,
            'compare' => '='
        ];
    }

    if ($destacada !== null) {
        $meta_query[] = [
            'key'     => 'destacada',
            'value'   => $destacada ? '1' : '0',
            'compare' => '='
        ];
    }

    if (!empty($meta_query)) {
        $args['meta_query'] = $meta_query;
    }

    if (!empty($zona)) {
        $args['tax_query'] = [
            [
                'taxonomy' => 'zona',
                'field'    => 'slug',
                'terms'    => $zona,
            ]
        ];
    }

    $query = new WP_Query($args);
    $listings = [];

    foreach ($query->posts as $post) {
        $id = $post->ID;
        
        // Obtener metadatos (ACF o Custom Fields nativos)
        $precio    = get_post_meta($id, 'precio', true) ?: get_post_meta($id, 'precio_mes', true) ?: 45000;
        $moneda    = get_post_meta($id, 'moneda', true) ?: 'ARS';
        $periodo   = get_post_meta($id, 'periodo', true) ?: 'mes';
        $tipo_val  = get_post_meta($id, 'tipo', true) ?: 'cubierta';
        $dest_val  = (bool) (get_post_meta($id, 'destacada', true) ?: false);
        $direccion = get_post_meta($id, 'direccion', true) ?: '';
        $ciudad    = get_post_meta($id, 'ciudad', true) ?: 'CABA';
        $lat       = get_post_meta($id, 'lat', true) ?: -34.6037;
        $lng       = get_post_meta($id, 'lng', true) ?: -58.3816;
        $features  = get_post_meta($id, 'features', true);
        if (is_string($features)) {
            $features = array_map('trim', explode(',', $features));
        } elseif (!is_array($features)) {
            $features = ['Cubierta', 'Seguridad 24hs'];
        }

        // Obtener zona desde taxonomía o meta
        $zonas_terms = wp_get_post_terms($id, 'zona', ['fields' => 'names']);
        $zona_name = !empty($zonas_terms) ? $zonas_terms[0] : (get_post_meta($id, 'zona', true) ?: 'CABA');

        // Imagen destacada y galería
        $thumb_id = get_post_thumbnail_id($id);
        $thumb_url = $thumb_id ? wp_get_attachment_image_url($thumb_id, 'full') : 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80';

        $imagenes = [
            [
                'url'    => $thumb_url,
                'alt'    => get_post_meta($thumb_id, '_wp_attachment_image_alt', true) ?: $post->post_title,
                'width'  => 1200,
                'height' => 900
            ]
        ];

        $listings[] = [
            'id'              => $id,
            'slug'            => $post->post_name,
            'titulo'          => $post->post_title,
            'zona'            => $zona_name,
            'ciudad'          => $ciudad,
            'direccion'       => $direccion,
            'precio'          => floatval($precio),
            'moneda'          => $moneda,
            'periodo'         => $periodo,
            'tipo'            => strtolower($tipo_val),
            'features'        => array_values($features),
            'destacada'       => $dest_val,
            'disponible'      => true,
            'imagenDestacada' => $thumb_url,
            'imagenes'        => $imagenes,
            'descripcion'     => apply_filters('the_content', $post->post_content),
            'lat'             => floatval($lat),
            'lng'             => floatval($lng),
        ];
    }

    $response = new WP_REST_Response($listings, 200);
    $response->header('X-WP-Total', $query->found_posts);
    $response->header('X-WP-TotalPages', $query->max_num_pages);

    return $response;
}
