import React from 'react';
import { createPortal } from 'react-dom';
import { IoMdClose } from 'react-icons/io';
import { useRouter } from 'next/navigation';

const ConfirmDialog = ({ show, onClose, message, url }:any) => {
  const router = useRouter();
    
  const handleClicked = () => {
    router.push(url)
  }

  if (!show) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-6 sm:mx-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3"
        >
          <IoMdClose size={24} className="text-gray-600 hover:text-gray-800" />
        </button>
        <div className="text-center mt-5">
          <p className="text-lg mb-4">{message}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleClicked}
              className="px-4 py-2 bg-primary text-secondary text-xl rounded-md"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmDialog;

export const ConfirmDialogX = ({ toggle, handleClicked, message }:any) => {
  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-6 sm:mx-auto relative">
        <button
          onClick={toggle}
          className="absolute top-3 right-3"
        >
          <IoMdClose size={24} className="text-gray-600 hover:text-gray-800" />
        </button>
        <div className="text-center mt-5">
          <p className="text-lg mb-4">{message}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleClicked}
              className="px-4 py-2 bg-primary text-secondary text-xl rounded-md"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
