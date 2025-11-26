import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-[100] animate-slide-in">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[320px] ${
          type === 'error'
            ? 'bg-[#FEF2F2] border border-[#EF4444] text-[#991B1B]'
            : 'bg-[#F0FDF4] border border-[#10B981] text-[#065F46]'
        }`}
      >
        {type === 'error' ? (
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-[#EF4444]" />
        ) : (
          <CheckCircle className="w-5 h-5 flex-shrink-0 text-[#10B981]" />
        )}
        <p className="flex-1">{message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
