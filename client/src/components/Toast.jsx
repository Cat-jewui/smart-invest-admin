import React, { useEffect } from 'react';

const Toast = ({ show, message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(t);
  }, [show, duration, onClose]);

  if (!show) return null;

  const colors = {
    info: 'bg-blue-600 text-white',
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white'
  };

  return (
    <div className="fixed right-4 bottom-6 z-50">
      <div className={`rounded-lg shadow-lg px-4 py-3 ${colors[type]}`}>
        <div className="flex items-center gap-3">
          <div className="font-medium">{message}</div>
          <button onClick={() => onClose && onClose()} className="ml-2 text-sm opacity-80">닫기</button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
