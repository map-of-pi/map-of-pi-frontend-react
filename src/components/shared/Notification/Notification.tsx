import React from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { IoMdClose } from 'react-icons/io';

function Notification({ onClose, message, url }:any) {
  const router = useRouter();

   const handleClicked = () => {
     router.push(url);
   }
 
   return createPortal(
     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
       <div className="bg-white rounded-lg p-4 w-[80%] max-w-[250px] relative">
         <button
           onClick={onClose}
           className="absolute top-3 right-3"
         >
           <IoMdClose size={24} className="text-gray-600 hover:text-gray-800" />
         </button>
         <div className="text-center mt-3">
           <p className="text-2xl mb-4">{message}</p>
           <div className="flex justify-center mx-3">
             <button
               onClick={handleClicked}
               className="px-4 py-2 bg-primary text-secondary text-lg rounded-md"
             >
              See notifications
             </button>
           </div>
         </div>
       </div>
     </div>,
     document.body
   );
}

export default Notification;
