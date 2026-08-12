import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertCircle, RefreshCw, Server, ArrowRight } from 'lucide-react';
import { WordPressService } from '../../services/wordpressService';

interface WpStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (status: 'connected' | 'error' | 'fallback' | 'checking') => void;
}

export const WpStatusModal: React.FC<WpStatusModalProps> = ({ isOpen, onClose, onStatusChange }) => {
  const [urlInput, setUrlInput] = useState(WordPressService.getBaseUrl());
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setTestResult(null);

    WordPressService.setBaseUrl(urlInput);
    const result = await WordPressService.testConnection();
    
    setLoading(false);
    setTestResult(result);
    if (onStatusChange) {
      onStatusChange(WordPressService.getConfig().status);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-ink-900 border border-white/10 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-500">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Estado de Conexión WordPress</h3>
              <p className="text-xs text-muted-dark">Conexión dinámica vía REST API Headless</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-dark hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Status Box */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Server className="w-5 h-5 text-muted-dark" />
            <div>
              <span className="text-xs text-muted-dark block">Modo actual:</span>
              <span className="font-semibold text-sm flex items-center gap-1.5">
                {WordPressService.getConfig().status === 'connected' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Conectado a API en vivo</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400">Snapshot de Fallback seguro</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleTest} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-dark mb-1.5">
              URL Base de WordPress REST API
            </label>
            <div className="relative">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://tu-wordpress.com/wp-json"
                className="w-full px-3.5 py-2.5 bg-ink-950 border border-white/15 rounded-xl text-sm text-white placeholder-muted-dark focus:outline-none focus:border-brand-500 transition-colors"
                required
              />
            </div>
            <p className="text-[11px] text-muted-dark mt-1">
              Podés ingresar cualquier dominio WordPress con REST API expuesto o usar el plugin <code className="text-brand-400">wp-cocheras-api.php</code>.
            </p>
          </div>

          {/* Test result message */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                testResult.success
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verificando conexión...</span>
                </>
              ) : (
                <>
                  <span>Probar Conexión</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info box about mu-plugin */}
        <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-muted-dark space-y-1">
          <p className="font-semibold text-white">📁 MU-Plugin entregable:</p>
          <p>
            El archivo <code className="text-brand-400 font-mono">wp-cocheras-api.php</code> ya está generado en la raíz del proyecto para instalar en <code className="text-white">wp-content/mu-plugins/</code> de tu WordPress.
          </p>
        </div>

      </div>
    </div>
  );
};
