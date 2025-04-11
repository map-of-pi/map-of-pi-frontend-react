import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import TrustMeter from '@/components/shared/Review/TrustMeter';
import { Button } from '../Forms/Buttons/Buttons';

import logger from '../../../../logger.config.mjs';

const MapMarkerPopup = ({ seller }: { seller: any }) => {
  const t = useTranslations();
  const locale = useLocale();

  const imageUrl =
    seller.image && seller.image.trim() !== ''
      ? seller.image
      : '/images/logo.svg';

 const truncateChars = (text: string, maxChars: number): string => {
        return text.length > maxChars ? text.slice(0, maxChars) + '...' : text;
      };
      
      


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
  style={{
    fontWeight: 'bold',
    fontSize: '15px',
    marginBottom: '2px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }}
>
  {truncateChars(seller.name, 12)} {/* Adjust limit as needed */}
</h2>



        {seller.seller_type && (
         <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '0px', marginBottom: '4px' }}>
  {translateSellerCategory(seller.seller_type)}
</p>

        )}
      </div>

      {/* Seller image - Close to seller type */}
      <div style={{ width: '150px', height: '70px', overflow: 'hidden', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <Image
    src={imageUrl}
    alt="Seller Image"
    width={imageUrl === '/images/logo.svg' ? 80 : 150}
    height={imageUrl === '/images/logo.svg' ? 40 : 70}
    style={{
      objectFit: imageUrl === '/images/logo.svg' ? 'contain' : 'cover',
      width: imageUrl === '/images/logo.svg' ? '80px' : '100%',
      height: imageUrl === '/images/logo.svg' ? '40px' : '100%',
    }}
  />
</div>



      {/* Trust-o-meter Label - Close to image */}
      <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px', marginBottom: '2px' }}>
        Trust-o-meter
      </p>

      {/* Trust-o-meter - Close to the Trust-o-meter label */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '8px' }}>
        <TrustMeter
          ratings={seller.trust_meter_rating}
        />
      </div>

      {/* Link to Buy button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>
        <Link
          href={`/${locale}/seller/sale-items/${seller.seller_id}`} // Update to your target link
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

