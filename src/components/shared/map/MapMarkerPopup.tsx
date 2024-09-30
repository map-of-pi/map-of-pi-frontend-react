import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import TrustMeter from '@/components/shared/Review/TrustMeter';
import { Button } from '../Forms/Buttons/Buttons';
import { useState } from 'react';
import logger from '../../../../logger.config.mjs';

const MapMarkerPopup = ({ seller }: any) => {
  const t = useTranslations();
  const [isVisible, setIsVisible] = useState(true);

  // Function to close the popup when "X" is pressed
  const handleClosePopup = () => {
    setIsVisible(false);
  };

  const imageUrl =
    seller.image && seller.image.trim() !== ""
      ? seller.image
      : process.env.NEXT_PUBLIC_IMAGE_PLACEHOLDER_URL || '/images/shared/upload.png';

  logger.info('Rendering MapMarkerPopup for seller:', { seller });

  // Render nothing if the popup is closed
  if (!isVisible) return null;

  return (
    // Main container with centered content using Flexbox, shadow and background color removed
    <div className="relative z-20 flex flex-col justify-center items-center p-4 rounded-md">
      {/* Close Button */}
      <button
        onClick={handleClosePopup}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Seller Name */}
      <h2 className="font-bold text-sm text-center mb-1">{seller.name}</h2>

      {/* Seller Type */}
      {seller.seller_type && (
        <p className="text-xs text-gray-500 text-center mb-1">
          {seller.seller_type}
        </p>
      )}

      {/* Seller Image */}
      <Image
        src={imageUrl}
        alt="Seller Image"
        width={200} // Adjust this width if needed
        height={100} // Adjust this height if needed
        className="rounded-md object-cover mb-1"
      />

      {/* Trust Meter */}
      <p className="text-center font-bold text-xs mb-1">Trust-o-meter</p>
      <TrustMeter ratings={seller.trust_meter_rating} className="mb-1" />

      {/* Buy Button */}
      <Link
        href={`/seller/sale-items/${seller.seller_id}`}
        className="flex justify-center"
      >
        <Button
          label={t('SHARED.BUY')}
          styles={{
            color: '#ffffff',
            backgroundColor: '#4caf50',
            paddingTop: '4px',
            paddingBottom: '4px',
            width: '60px',
          }}
        />
      </Link>

      {/* Tooltip Arrow */}
      <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-200"></div>
    </div>
  );
};

export default MapMarkerPopup;
