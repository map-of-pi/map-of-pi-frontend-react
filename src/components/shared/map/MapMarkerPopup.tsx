import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import TrustMeter from '@/components/shared/Review/TrustMeter';
import { Button } from '../Forms/Buttons/Buttons';

import logger from '../../../../logger.config.mjs';

const MapMarkerPopup = ({ seller }:any) => {
  const t = useTranslations();
  const SUBHEADER = 'font-bold mb-2';
  
  const imageUrl = seller.image && seller.image.trim() !== "" ? seller.image : process.env.NEXT_PUBLIC_IMAGE_PLACEHOLDER_URL || '/images/shared/upload.png'
  
  logger.info('Rendering MapMarkerPopup for seller:', { seller });
  return (
    <>
      <div className="min-w-sm rounded-md justify-center mx-auto">
        {/* Seller Profile */}
        <div className="font-bold text-base mb-2">
          {seller.name}
          <span className="ps-2">({seller.trust_meter_rating}%)</span>
        </div>
        <div className="flex gap-2 mb-2 items-center">
          <div className="relative w-[50px] h-[50px] min-w-[50px] min-h-[50px]">
            <Image
              className="rounded-lg m-0 my-auto"
              src={imageUrl}
              alt="seller logo"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'contain', maxHeight: '200px', maxWidth: '100%' }}
            />
          </div>
          <div className="font-bold line-clamp-3 m-0 p-0">
            {seller.description}
          </div>
        </div>
        <div>
          <TrustMeter ratings={seller.trust_meter_rating} />
        </div>
        {/* Items List */}
        <h2 className={`${SUBHEADER} text-base`}>
          {t('POPUP.MAP_MARKER.SELLER_SALE_ITEMS_FIELD')}
        </h2>
        <div className="seller_item_container mb-1 max-h-[200px] overflow-auto">
          <p>{seller.sale_items}</p>
        </div>
        <div className="font-bold m-3">
          {t('POPUP.MAP_MARKER.DISTANCE_MESSAGE')}
        </div>

        <div className="flex space-x-4 gap-2">
          <Link
            href={`/seller/sale-items/${seller.seller_id}`} //change to items list screen
            className="flex-1">
              <Button label={t('SHARED.BUY')} styles={{color: '#ffc153', paddingTop: '6px', paddingBottom: '6px', width: '100%' }} />
          </Link>
        </div>
      </div>
    </>
  );
};

export default MapMarkerPopup;
