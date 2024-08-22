import React from 'react';

interface LogoutConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutConfirmation: React.FC<LogoutConfirmationProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <p className="text-black mb-4">Are you sure you want to log out?</p>
        <div className="flex justify-end">
          <button onClick={onCancel} className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmation;
