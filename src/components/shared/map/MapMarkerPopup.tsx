import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TrustMeter from '@/components/shared/Review/TrustMeter';
import { Button, OutlineBtn } from '../Forms/Buttons/Buttons';

interface Seller {
  business: string;
  ratings: number;
  image: string;
  description: string;
  sale_items: string;
}

interface MapMarkerPopupProps {
  seller: Seller;
}

const MapMarkerPopup: React.FC<MapMarkerPopupProps> = ({ seller }) => {
  const t = useTranslations();
  const SUBHEADER = 'font-bold mb-2';
  const router = useRouter();

  return (
    <>
      <div className="max-w-sm rounded-md justify-center mx-auto">
        {/* Seller Profile */}
        <div className="font-bold text-base mb-2">
          {seller.business}
          <span className="ps-2">({seller.ratings}/5.0)</span>
        </div>
        <div className="flex gap-2 mb-2 items-center">
          <div className="relative w-[50px] h-[50px] min-w-[50px] min-h-[50px]">
            <Image
              alt="seller logo"
              src={seller.image}
              fill={true}
              className="rounded-lg m-0 my-auto"
            />
          </div>
          <div className="font-bold line-clamp-3 m-0 p-0">
            {seller.description}
          </div>
        </div>
        <div>
          <TrustMeter ratings={seller.ratings} />
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
            href={'/seller/sale-items'} //change to items list screen
            className="flex-1">
            <Button label={t('SHARED.BUY')} styles={{ color: '#ffc153', paddingTop: '6px', paddingBottom: '6px', width: '100%' }} />
          </Link>
          <Link
            href={'/seller/location'} // change to navigate url
            className="flex-1">
            <OutlineBtn label={t('SHARED.NAVIGATE')} styles={{ color: '#ffc153', paddingTop: '6px', paddingBottom: '6px', width: '100%' }} />
          </Link>
        </div>
      </div>
    </>
  );
};

export default MapMarkerPopup;
