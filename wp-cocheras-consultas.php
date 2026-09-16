<?php
/**
 * Plugin Name: Cocheras — Consultas del sitio
 * Description: Recibe las consultas del sitio headless (Contacto, Publicar y ficha de propiedad) y las envía por email. Expone POST /wp-json/cocheras/v1/consulta.
 * Version: 1.0.0
 * Author: Cocheras.com.ar
 *
 * INSTALACIÓN (Diego):
 *   1. Subir este archivo a wp-content/plugins/cocheras-consultas/wp-cocheras-consultas.php
 *      (o comprimirlo en un .zip y cargarlo desde Plugins → Añadir nuevo → Subir plugin).
 *   2. Activarlo en Plugins.
 *   3. Verificar que el correo de destino de abajo sea el correcto.
 *
 * Con eso los formularios del sitio dejan de depender de WhatsApp: el mensaje
 * llega a la casilla configurada y se puede responder directo (el Reply-To es
 * el email de quien consultó).
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Casilla que recibe las consultas. */
if (!defined('COCHERAS_CONSULTAS_EMAIL')) {
    define('COCHERAS_CONSULTAS_EMAIL', 'info@cocheras.com.ar');
}

/**
 * Dominio del sitio que puede enviar consultas. Mientras el frontend esté en
 * otro dominio distinto al de WordPress, tiene que figurar acá. `*` permite
 * cualquiera; conviene reemplazarlo por el dominio real en producción,
 * por ejemplo 'https://www.cocheras.com.ar'.
 */
if (!defined('COCHERAS_CONSULTAS_ORIGEN')) {
    define('COCHERAS_CONSULTAS_ORIGEN', '*');
}

/** Máximo de consultas por IP cada 10 minutos (anti-spam básico). */
if (!defined('COCHERAS_CONSULTAS_MAX_POR_IP')) {
    define('COCHERAS_CONSULTAS_MAX_POR_IP', 5);
}

add_action('rest_api_init', function () {
    register_rest_route('cocheras/v1', '/consulta', [
        'methods'             => 'POST',
        'callback'            => 'cocheras_recibir_consulta',
        'permission_callback' => '__return_true',
    ]);
});

function cocheras_recibir_consulta(WP_REST_Request $request)
{
    $datos = $request->get_json_params();
    if (!is_array($datos)) {
        $datos = $request->get_params();
    }

    // Honeypot: el campo "website" está oculto en el formulario. Si viene con
    // contenido lo completó un bot; se responde OK para no darle pistas.
    if (!empty($datos['website'])) {
        return new WP_REST_Response(['ok' => true], 200);
    }

    $nombre     = sanitize_text_field($datos['nombre'] ?? '');
    $email      = sanitize_email($datos['email'] ?? '');
    $telefono   = sanitize_text_field($datos['telefono'] ?? '');
    $mensaje    = sanitize_textarea_field($datos['mensaje'] ?? '');
    $origen     = sanitize_text_field($datos['origen'] ?? 'Sitio web');
    $referencia = sanitize_text_field($datos['referencia'] ?? '');

    if ($nombre === '' || !is_email($email) || $mensaje === '') {
        return new WP_Error(
            'datos_invalidos',
            'Faltan datos obligatorios: nombre, email válido y mensaje.',
            ['status' => 400]
        );
    }

    // Límite por IP.
    $ip        = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : '0.0.0.0';
    $clave     = 'cocheras_consulta_' . md5($ip);
    $enviadas  = (int) get_transient($clave);
    if ($enviadas >= COCHERAS_CONSULTAS_MAX_POR_IP) {
        return new WP_Error(
            'demasiadas_consultas',
            'Recibimos varias consultas seguidas desde tu conexión. Probá de nuevo en unos minutos o escribinos por WhatsApp.',
            ['status' => 429]
        );
    }
    set_transient($clave, $enviadas + 1, 10 * MINUTE_IN_SECONDS);

    $destino = apply_filters('cocheras_consultas_destino', COCHERAS_CONSULTAS_EMAIL);

    $asunto = sprintf('[Cocheras] Consulta desde %s%s', $origen, $referencia !== '' ? " — {$referencia}" : '');

    $lineas = [
        "Nombre: {$nombre}",
        "Email: {$email}",
        'Teléfono: ' . ($telefono !== '' ? $telefono : 'no informado'),
        "Origen: {$origen}",
    ];
    if ($referencia !== '') {
        $lineas[] = "Referencia: {$referencia}";
    }
    $lineas[] = '';
    $lineas[] = $mensaje;
    $lineas[] = '';
    $lineas[] = '— Enviado desde el formulario del sitio el ' . wp_date('d/m/Y H:i');

    $cabeceras = [
        'Content-Type: text/plain; charset=UTF-8',
        sprintf('Reply-To: %s <%s>', $nombre, $email),
    ];

    $enviado = wp_mail($destino, $asunto, implode("\n", $lineas), $cabeceras);

    if (!$enviado) {
        return new WP_Error(
            'envio_fallido',
            'No pudimos enviar el mensaje en este momento.',
            ['status' => 500]
        );
    }

    return new WP_REST_Response(['ok' => true], 200);
}

/**
 * CORS: el frontend vive en otro dominio, así que el navegador exige que
 * WordPress lo autorice explícitamente para aceptar el POST.
 */
add_action('rest_api_init', function () {
    add_filter('rest_pre_serve_request', function ($served, $result, $request) {
        if (strpos($request->get_route(), '/cocheras/v1/') !== 0) {
            return $served;
        }
        header('Access-Control-Allow-Origin: ' . COCHERAS_CONSULTAS_ORIGEN);
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        header('Vary: Origin');
        return $served;
    }, 10, 3);
}, 15);
