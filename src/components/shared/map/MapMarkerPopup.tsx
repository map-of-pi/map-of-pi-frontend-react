import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import TrustMeter from '@/components/shared/Review/TrustMeter';
import { Button, CloseButton } from '../Forms/Buttons/Buttons';
import logger from '../../../../logger.config.mjs';

const MapMarkerPopup = ({ seller }: { seller: any }) => {
  const [isVisible, setIsVisible] = useState(true); // Control popup visibility
  const t = useTranslations();

  const imageUrl =
    seller.image && seller.image.trim() !== ''
      ? seller.image
      : process.env.NEXT_PUBLIC_IMAGE_PLACEHOLDER_URL || '/images/shared/upload.png';

  logger.info('Rendering MapMarkerPopup for seller:', { seller });

  const handleClose = () => {
    logger.info('Close button clicked');
    setIsVisible(false); // Hide the popup when the "X" is clicked
  };

  if (!isVisible) {
    return null; // Return null to remove the popup from the DOM
  }

  return (
    <div className="relative z-20 p-4 bg-white rounded-md shadow-lg">
      {/* Flex container for seller name and X button */}
      <div className="flex justify-between items-center w-full mb-2">
        {/* Seller name with more margin to the right */}
        <h2 className="font-bold text-sm">{seller.name}</h2>

        {/* CloseButton positioned on the same level as seller name */}
        <CloseButton onClick={handleClose} className="ml-4" />
      </div>

      {/* Seller type */}
      {seller.seller_type && (
        <p className="text-xs text-gray-500 text-center mt-0.5 mb-1">
          {seller.seller_type}
        </p>
      )}

      {/* Seller image */}
      <Image
        src={imageUrl}
        alt="Seller Image"
        width={200}
        height={100}
        className="rounded-md object-cover mb-1 mx-auto"
      />

      {/* Trust-o-meter label */}
      <p className="text-center font-bold text-xs mt-0.5 mb-0">Trust-o-meter</p>

      {/* TrustMeter component without className */}
      <TrustMeter ratings={seller.trust_meter_rating} />

      {/* Button link */}
      <Link href={`/seller/sale-items/${seller.seller_id}`} className="flex justify-center mt-2">
        <Button
          label={t('SHARED.BUY')}
          styles={{
            color: '#ffffff',
            backgroundColor: '#025e05',
            paddingTop: '2px',
            paddingBottom: '2px',
            width: '60px',
          }}
        />
      </Link>

      {/* Arrow indicator below the popup */}
      <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-200"></div>
    </div>
  );
};

export default MapMarkerPopup;
