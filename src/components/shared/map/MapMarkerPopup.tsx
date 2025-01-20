import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import TrustMeter from '@/components/shared/Review/TrustMeter';
import { Button } from '../Forms/Buttons/Buttons';

import logger from '../../../../logger.config.mjs';

const MapMarkerPopup = ({ seller }: { seller: any }) => {
  const t = useTranslations();
  const locale = useLocale();
  const nameRef = useRef<HTMLHeadingElement>(null);
  const [imageHeight, setImageHeight] = useState(100); // Default height

  const [imageSize, setImageSize] = useState(110);  // Default image size
  const [placeholderSize, setPlaceholderSize] = useState(60);  // Default placeholder size
  
  useEffect(() => {
    if (nameRef.current) {
      const nameHeight = nameRef.current.offsetHeight;
  
      // Reduce image size when name wraps
      if (nameHeight > 22) {
        setImageSize(70);  // Shrink actual image
        setPlaceholderSize(50);  // Shrink placeholder image
      } else {
        setImageSize(105);
        setPlaceholderSize(60);
      }
    }
  }, [seller.name]);
  
  const imageUrl =
  seller.image && seller.image.trim() !== ''
    ? seller.image
    : process.env.NEXT_PUBLIC_IMAGE_PLACEHOLDER_URL || '/images/logo.svg'; // Placeholder fallback

  const translateSellerCategory = (category: string): string => {
    switch (category) {
      case 'activeSeller':
        return t('SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.ACTIVE_SELLER');
      case 'inactiveSeller':
        return t('SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.INACTIVE_SELLER');
      case 'testSeller':
        return t('SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.TEST_SELLER');
      default:
        return '';
    }
  };

  logger.info('Rendering MapMarkerPopup for seller:', { seller });

  return (
    <div style={{ position: 'relative', zIndex: 20, padding: '10px' }}>
      {/* Seller name and type - Close with a small gap */}
      <div style={{ textAlign: 'center', marginBottom: '5px' }}>
        <h2
          ref={nameRef}
          style={{
            fontWeight: 'bold',
            fontSize: '16px', // Slightly smaller font size
            marginBottom: '2px',
            lineHeight: '1.2',
            overflow: 'hidden', // Ensure content doesn't overflow
            textOverflow: 'ellipsis', // Adds ellipsis for overflow
            display: '-webkit-box', // Required for line-clamp to work
            WebkitLineClamp: 2, // Limit to 2 lines
            WebkitBoxOrient: 'vertical', // Required for line-clamp
          }}
        >
          {seller.name}
        </h2>
        {seller.seller_type && (
          <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '0px', marginBottom: '4px' }}>
            {translateSellerCategory(seller.seller_type)}
          </p>
        )}
      </div>

      {/* Seller image */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
      <Image
        src={imageUrl}
        alt="Seller Image"
        width={
          imageUrl === (process.env.NEXT_PUBLIC_IMAGE_PLACEHOLDER_URL || '/images/logo.svg')
            ? 60  // Reduced from 75 to 70
            : 105 // Reduced from 120 to 110
        }
        height={
          imageUrl === (process.env.NEXT_PUBLIC_IMAGE_PLACEHOLDER_URL || '/images/logo.svg')
            ? 60  // Reduced from 75 to 70
            : imageHeight * 0.9  // Slightly reduce by 10%
        }
      />
      </div>

      {/* Trust-o-meter Label - Close to image */}
      <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px', marginBottom: '2px' }}>
        Trust-o-meter
      </p>

      {/* Trust-o-meter - Close to the Trust-o-meter label */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '8px' }}>
        <TrustMeter ratings={seller.trust_meter_rating}/>
      </div>

      {/* Link to Buy button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>
        <Link href={`/${locale}/seller/sale-items/${seller.seller_id}`} // Include locale dynamically
          style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
        >
          <Button
            label={t('SHARED.BUY')}
            styles={{
              color: '#ffc153',
              paddingTop: '6px',
              paddingBottom: '6px',
              width: '35%',
              textAlign: 'center',
            }}
          />
        </Link>
      </div>
    </div>
  );
};

export default MapMarkerPopup;
