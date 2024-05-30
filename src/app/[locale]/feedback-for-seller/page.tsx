
import React, { ChangeEvent, useState } from 'react';

interface Feedback {
  satisfaction: number;
  comment: string;
  photos: File[];
  sellerName: string;
}

const FeedbackForSeller: React.FC = () => {
  const [feedback, setFeedback] = useState<Feedback>({ satisfaction: 0, comment: '', photos: [], sellerName: '' });
  const [unsavedChanges, setUnsavedChanges] = useState(false);

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
      return confirm('You have unsaved changes. Are you sure you want to leave?');
    }
    return true;
  };

  // Fetch seller name from the database
  const fetchSellerName = () => {
    // Fetch logic here
    const sellerNameFromDB = 'Seller Name'; // Placeholder
    setFeedback({ ...feedback, sellerName: sellerNameFromDB });
  };

    function handleCommentChange(event: ChangeEvent<HTMLTextAreaElement>): void {
        throw new Error('Function not implemented.');
    }

    function handleSatisfactionChange(event: ChangeEvent<HTMLInputElement>): void {
        throw new Error('Function not implemented.');
    }

  return (
    <div className='p-4'>
      <div className='bg-white rounded-lg shadow-md p-5'>
        <h2 className='text-lg font-semibold mb-4'>Seller Feedback</h2>
        <div className='mb-4'>
          <button onClick={fetchSellerName} className='bg-gray-200 py-2 px-4 rounded-lg'>
            {feedback.sellerName || 'Tap to display all Seller information'}
          </button>
        </div>
        <label htmlFor='satisfaction' className='block mb-2'>Satisfaction Level</label>
        <input
          type='range'
          id='satisfaction'
          name='satisfaction'
          min='1'
          max='5'
          value={feedback.satisfaction}
          onChange={handleSatisfactionChange}
          className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
        />
        <label htmlFor='comment' className='block mt-4 mb-2'>Additional Comments</label>
        <textarea
          id='comment'
          name='comment'
          rows={3}
          placeholder='Type your comment here...'
          value={feedback.comment}
          onChange={handleCommentChange}
          className='w-full p-2 border rounded-lg'
        />
        <label htmlFor='photo-upload' className='block mt-4 mb-2'>Upload Photos</label>
        <input
          type='file'
          id='photo-upload'
          name='photo-upload'
          multiple
          onChange={handlePhotoUpload}
          className='w-full p-2 border rounded-lg'
        />
        <button
          onClick={handleSubmit}
          className='mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg'
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default FeedbackForSeller;
