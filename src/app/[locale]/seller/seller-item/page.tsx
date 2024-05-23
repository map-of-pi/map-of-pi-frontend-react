import { useTranslations } from 'next-intl';
import TrustMeter from '@/components/seller/TrustMeter';
import Image from 'next/image';
import Link from 'next/link';
// import { useRouter } from 'next/navigation';

// const router = useRouter();

export default function Page(){
    const t = useTranslations();
    
    // synthentic database data
    const itemData = {
        seller: {
            business: "Peejenn",
            url: "/images/shared/upload.png",
            category: "Pioneer",
            ratings: 3,
            address: "Crescent Way, Bab 2/4, Newyork City",
            description: "Discover handcrafted jewelry and artisanal candles, available for purchase using Pi cryptocurrency. Elevate your space and style wit our unique offerings today.",
        },
        items: [
            {
                id: 10,
                name: "Bicycle",
                price: 10,
            },
            {
                id: 9,
                name: 'Books',
                price: 4,
            },
            {
                id: 8,
                name: 'House',
                price: 5,
            },
            {
                id: 7,
                name: 'Two Shirt',
                price: 7,
            },
            
        ]
    }

    return (
        <>
        <div className="bg-[#FFFFFF] w-full md:w-[500px] md:mx-auto p-5">
            <h1 className='mb-5 font-bold'>Buy From Seller</h1> 

            {/* Seller Profile */}
            <div className='flex gap-4 align-center mb-4'>
                <Image alt='seller logo' src={itemData.seller.url} width={100} height={100} className='rounded-[100%]'/>
                <div className='my-auto'>
                    <h2 className='text-green-700 font-bold mb-2' >{itemData.seller.business}</h2>
                    <p className='text-sm'>{itemData.seller.category}</p>
                </div>
            </div> 

            {/* Seller Location  */}
            <div className='flex gap-2 mb-4 align-center'>
                <div>
                <Image alt='location pin'  src='/favicon-16x16.png' width={20} height={20}/>
                </div>  
                <div>
                    <h3 className='font-bold'>Local Sell Area</h3>
                    <div className='flex gap-3'>
                        <p>{itemData.seller.address}</p>
                        <div className='ms-auto text-yellow-600'>
                            <Link href={'/seller/configuration'}/>
                            Set Seller Centre
                        </div>
                    </div>   
                </div>      
            </div>

            {/* Seller Description */}
            <div className='mb-5'>
                <h2 className='font-bold mb-1'>Seller Description</h2>
                <p className='text-justify'>{itemData.seller.description}</p>   
            </div>         
             
             {/* Trust Ometer */}
            <p className='font-bold'>Trust Ometer</p>
            <TrustMeter ratings={itemData.seller.ratings} />

            {/* Review Button */}
            <button className="bg-yellow-500 py-2 px-5 rounded-[5px] ms-auto mb-3 flex justify-right">Reviews</button>  
            
            {/* Items List */}
            <div className="bg-red-50 mx-2 my-4 rounded-[8px] p-3">
                <p className='mb-2 font-bold'>Seller Items for Sale</p>
                <ul>
                    {itemData.items.map((item) => (
                        <>
                        <div className='flex gap-2'>
                            <li key={item.id}>{item.name}</li>
                            <li className='ms-auto'>{item.price} @</li>
                        </div>                        
                        </>
                    ))}
                </ul>    
            </div>            
        </div>
        </>
    )
}