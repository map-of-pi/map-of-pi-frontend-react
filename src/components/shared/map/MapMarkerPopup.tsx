import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import { itemData } from '@/constants/demoAPI';
import TrustMeter from '@/components/seller/TrustMeter';

const MapMarkerPopup = () => {
  const t = useTranslations();

  const SUBHEADER = "font-bold mb-2";

  return (
    <>
      <div className="max-w-sm rounded-md justify-center mx-auto">
        {/* Seller Profile */}
        <div className='font-bold text-base mb-1'> 
          {itemData.seller.business} 
          <span className='ps-2'>({itemData.seller.ratings}/5.0)</span>
        </div>
        <div className='flex gap-2 mb-1'>
          <Image alt='seller logo' src={itemData.seller.url} width={50} height={50} className='rounded-lg m-0 relative h-[70px] w-[70px] my-auto' />
          <p className='font-bold'>{itemData.seller.description}</p>
        </div>
        <div>
          <TrustMeter ratings={itemData.seller.ratings} />
        </div>

        {/* Items List */}
        <h2 className={`${SUBHEADER} text-base`}>{t('POPUP.MAP_MARKER.SELLER_SALE_ITEMS_FIELD')}</h2>
        <div className="seller_item_container mb-1 max-h-[200px] overflow-auto">
          <ul>
            {itemData.items.map((item) => (
              <div key={item.id} className='flex gap-2'>
                <li>{item.name}</li>
                <li>{item.price}Pi</li>
              </div>
            ))}
          </ul>
        </div>
        <div className='font-bold m-3'>{t('POPUP.MAP_MARKER.DISTANCE_MESSAGE')}</div>
    
        <div className="flex justify-between space-x-4 gap-2 text-lg">
          <Link
            href={'/seller/seller-item'} //change to items list screen
            className="px-3 py-1 bg-primary rounded-md w-full flex justify-center"
          >
            <span className='text-secondary'>{t('SHARED.BUY')}</span>
          </Link>
          <Link
            href={'/seller/seller-item'} // change to navigate url
            className="px-3 py-1 outline outline-[1px] outline-primary rounded-md w-full flex justify-center"
          >
            <span className='text-[#F6C367]'>{t('SHARED.NAVIGATE')}</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default MapMarkerPopup;
