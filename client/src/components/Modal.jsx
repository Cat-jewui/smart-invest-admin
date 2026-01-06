import React from 'react';

const Modal = ({ show, title, message, type = 'info', onClose, okText = '확인' }) => {
  if (!show) return null;

  const colors = {
    info: 'bg-blue-600',
    success: 'bg-green-600',
    error: 'bg-red-600'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative bg-dark-card border border-dark-border rounded-xl w-full max-w-md p-6 z-10">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colors[type]} text-white font-bold`}>!</div>
          <div className="flex-1">
            {title && <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>}
            <p className="text-gray-300">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {okText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
