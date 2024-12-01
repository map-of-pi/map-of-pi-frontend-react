import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import TrustMeter from '@/components/shared/Review/TrustMeter';
import { Button } from '../Forms/Buttons/Buttons';

import logger from '../../../../logger.config.mjs';

const MapMarkerPopup = ({ seller }: { seller: any }) => {
  const t = useTranslations();
  const nameRef = useRef<HTMLHeadingElement>(null);
  const [imageHeight, setImageHeight] = useState(100); // Default height

  // Dynamically adjust the image height based on name height
  useEffect(() => {
    if (nameRef.current) {
      const nameHeight = nameRef.current.offsetHeight;
      // Reduce image height slightly if name wraps (i.e., height > 22px)
      setImageHeight(nameHeight > 22 ? 75 : 100);
    }
  }, [seller.name]);

  const imageUrl =
    seller.image && seller.image.trim() !== ''
      ? seller.image
      : process.env.NEXT_PUBLIC_IMAGE_PLACEHOLDER_URL || '/images/shared/upload.png';

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
      {/* Seller name and type */}
      <div style={{ textAlign: 'center', marginBottom: '5px' }}>
        <h2
          ref={nameRef}
          style={{
            fontWeight: 'bold',
            fontSize: '18px',
            marginBottom: '2px',
            lineHeight: '1.2',
            overflowWrap: 'break-word', // Ensures long words break properly
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
      <div style={{ textAlign: 'center', marginBottom: '5px' }}>
        <Image
          src={imageUrl}
          alt="Seller Image"
          width={155}
          height={135} // Base dimensions
          style={{
            objectFit: 'cover',
            display: 'block',
            margin: '0 auto',
            maxHeight: `${imageHeight}px`, // Dynamic height based on name length
            width: 'auto',
          }}
        />
      </div>

      {/* Trust-o-meter Label */}
      <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px', marginBottom: '2px' }}>
        Trust-o-meter
      </p>

      {/* Trust-o-meter */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '150px',
          margin: '0 auto',
          marginBottom: '8px',
        }}
      >
        <TrustMeter ratings={seller.trust_meter_rating} />
      </div>

      {/* Link to Buy button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>
        <Link href={`/seller/sale-items/${seller.seller_id}`} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
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

