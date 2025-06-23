import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React from 'react';
import { IoMdClose } from 'react-icons/io';

function Notification({ onClose, message, url, setToggleNotification } : any) {
  const t = useTranslations();
  const router = useRouter();

  const handleClicked = () => {
    router.push(url);
    setToggleNotification(false);
  }

  const handleClose = () => {
  onClose;
  setToggleNotification(false);
  }
 
  return(
    <div className="bg-white rounded-2xl p-4 w-[80%] max-w-[230px] fixed top-1/2 left-1/2 z-100 translate-y-[-50%] translate-x-[-50%] shadow-sm border-2 border-solid border-gray-600">
      <button onClick={handleClose} className="absolute top-2 right-2">
        <IoMdClose size={24} className="text-gray-600 hover:text-gray-800" />
      </button>
      <div className="text-center mt-3">
        <p className="text-2xl mb-4">{message}</p>
        <div className="flex justify-center mx-3">
          <button
            onClick={handleClicked}
            className="px-4 py-2 bg-primary text-secondary text-lg rounded-md w-full"
          >
            {t('SHARED.VIEW_NOTIFICATIONS')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notification;