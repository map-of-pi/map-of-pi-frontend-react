import React from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

const ConfirmDialog = ({ show, onClose, setConfirm, message, url }:any) => {
    const router = useRouter();
    
    const handleClicked = () => {
        router.push(`/${url}`)
    }

    if (!show) return null;

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 sm:mx-auto relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M18.3 5.71L12 12l6.3 6.29a1 1 0 11-1.42 1.42L12 13.41l-6.29 6.3a1 1 0 11-1.42-1.42L10.59 12 4.3 5.71a1 1 0 011.42-1.42L12 10.59l6.29-6.3a1 1 0 011.42 1.42z"/></svg>

                </button>
                <div className="text-center mt-5">
                    <p className="text-lg mb-4">{message}</p>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={handleClicked}
                            className="px-4 py-2 bg-[#386F4F] text-white rounded-md"
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
