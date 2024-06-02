import Image from 'next/image';
import Link from 'next/link';
import { itemData } from '@/constants/demoAPI';
import TrustMeter from '@/components/seller/TrustMeter';

const MapMarkerPopup = () => {
    const SUBHEADER = "font-bold mb-2";

  return (
    <>
        <div className="max-w-sm rounded-md justify-center mx-auto">
            {/* Seller Profile */}
            <h1 className='font-bold text-base mb-1'> 
                {itemData.seller.business} 
                <span className='ps-2'>({itemData.seller.ratings}/5.0)</span>
            </h1>
            <div className='flex gap-2 mb-2'>
                <Image alt='seller logo' src={itemData.seller.url} width={50} height={50} className='rounded-lg h-[75px] w-[75px] my-auto' />
                <p className='font-bold text-justify '>{itemData.seller.description}</p>
            </div>
            <div>
              <TrustMeter ratings={itemData.seller.ratings} />
            </div>

            {/* Items List */}
            <h2 className={`${SUBHEADER} text-base`}>Seller items for sale</h2>
            <div className="seller_item_container mb-2 max-h-[200px] overflow-auto">
                <ul>
                    {itemData.items.map((item) => (
                        <div key={item.id} className='flex gap-2'>
                            <li>{item.name}</li>
                            <li>{item.price}Pi</li>
                        </div>
                    ))}
                </ul>
            </div>
            <p className='font-bold'>Distance: <span>XXX km</span> away</p>
        
            <div className="flex justify-between space-x-4 gap-2 text-lg">
                <Link
                href={'/seller/seller-item'} //change to items list screen
                className="px-3 py-1 bg-[#386F4F] rounded-md w-full flex justify-center"
                >
                    <span className='text-[#F6C367]'>Buy</span>
                    {/* <Link href={'/seller/seller-item'} className='text-[#F6C367]'>Buy</Link> */}
                </Link>
                <Link
                href={'/seller/seller-item'} // change to navigate url
                className="px-3 py-1 outline outline-[1px] outline-[#386F4F]  rounded-md w-full flex justify-center"
                >
                    <span className='text-[#F6C367]'>Navigate</span>
                </Link>
            </div>
        </div>
    </>
  );
};

export default MapMarkerPopup;
