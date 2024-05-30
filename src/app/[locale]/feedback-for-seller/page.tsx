import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Feedback {
  satisfaction: number;
  comment: string;
  photos: File[];
  sellerName: string;
}

const FeedbackForSeller: React.FC = () => {
  const [feedback, setFeedback] = useState<Feedback>({ satisfaction: 0, comment: '', photos: [], sellerName: '' });
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isSaveButtonActive, setIsSaveButtonActive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (unsavedChanges) {
      setIsSaveButtonActive(true);
    } else {
      setIsSaveButtonActive(false);
    }
  }, [unsavedChanges]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
    setUnsavedChanges(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFeedback({ ...feedback, photos: Array.from(e.target.files) });
      setUnsavedChanges(true);
    }
  };

  const handleSubmit = () => {
    // Submit feedback logic here
    console.log(feedback);
    setUnsavedChanges(false);
  };

  const handleNavigationAway = () => {
    if (unsavedChanges) {
      const userConfirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (userConfirmed) {
        // User confirmed they want to navigate away and lose unsaved changes
        setUnsavedChanges(false);
        return true;
      } else {
        // User cancelled navigation
        return false;
      }
    }
    return true;
  };

  // Fetch seller name from the database
  const fetchSellerName = () => {
    // Fetch logic here
    const sellerNameFromDB = 'Seller Name'; // Placeholder
    setFeedback({ ...feedback, sellerName: sellerNameFromDB });
  };

  return (
    <div className='p-4'>
      <div className='bg-white rounded-lg shadow-md p-5'>
        <h2 className='text-lg font-semibold mb-4'>Seller Feedback</h2>
        <div className='mb-4'>
          <button onClick={fetchSellerName} className='bg-gray-200 py-2 px-4 rounded-lg'>
            {feedback.sellerName || 'Tap to display all Seller information'}
          </button>
        </div>
        {/* Rest of the component */}
        <button
          onClick={handleSubmit}
          disabled={!isSaveButtonActive}
          className={`mt-4 ${isSaveButtonActive ? 'bg-blue-500' : 'bg-blue-200'} text-white py-2 px-4 rounded-lg`}
        >
          Save Feedback
        </button>
      </div>
    </div>
  );
};

export default FeedbackForSeller;
