"use client";

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import TrustMeter from '@/components/seller/TrustMeter';
import EmojiPicker from '@/components/shared/Review/emojipicker';
import { FileInput, TextArea } from '@/components/shared/Forms/Inputs/Inputs';
import Image from 'next/image';
import Link from 'next/link';

// import { useRouter } from 'next/navigation';
// const router = useRouter();

export default function Page() {
    const t = useTranslations();

    // synthetic database data
    const itemData = {
        seller: {
            business: "Peejenn",
            url: "/images/shared/upload.png",
            category: "Pioneer",
            ratings: 4.1,  // the trust-o-meter changed when adjusted 
            address: "Crescent Way, Bab 2/4, New York City",
            description: "Discover handcrafted jewelry and artisanal candles, available for purchase using Pi cryptocurrency. Elevate your space and style with our unique offerings today.",
            reviews: {
                Despair: 1,
                Sad: 2,
                Okay: 15,
                Happy: 11,
                Delight: 6
            }
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

    const [files, setFiles] = useState<File[]>([]);
    const [previewImage, setPreviewImage] = useState<string[]>([]);

    const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            setFiles(Array.from(selectedFiles));
        }
    };

    useEffect(() => {
        if (files.length === 0) return;

        const objectUrls = files.map(file => URL.createObjectURL(file));
        setPreviewImage(objectUrls);

        return () => {
            objectUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [files]);

    return (
        <div className="bg-[#FFFFFF] w-full md:w-[500px] md:mx-auto p-4">
            <h1 className='mb-5 font-bold text-2xl'>Buy From Seller</h1>

            {/* Seller Profile */}
            <div className='flex gap-4 align-center mb-6'>
                <Image alt='seller logo' src={itemData.seller.url} width={100} height={100} className='rounded-[100%]' />
                <div className='my-auto'>
                    <h2 className='font-bold mb-2'>{itemData.seller.business}</h2>
                    <p className='text-sm'>{itemData.seller.category}</p>
                </div>
            </div>

            {/* Seller Description */}
            <div className='mb-5'>
                <h2 className='font-bold mb-1'>Seller Description</h2>
                <p className='text-justify'>{itemData.seller.description}</p>
            </div>

            {/* Items List */}
            <h2 className='my-2 font-bold'>Seller Items for sale</h2>
            <div className="bg-zinc-100 mx-2 mb-6 rounded-[8px] p-3">
                <ul>
                    {itemData.items.map((item) => (
                        <div key={item.id} className='flex gap-2'>
                            <li>{item.name}</li>
                            <li>{item.price}Pi</li>
                        </div>
                    ))}
                </ul>
            </div>

            {/* Seller Location */}
            <div className='flex gap-2 mb-7 align-center'>
                <div>
                    <Image alt='location pin' src='/favicon-16x16.png' width={20} height={20} />
                </div>
                
                <div>
                    <h2 className='font-bold'>Seller Address or Whereabouts</h2>
                    <p>{itemData.seller.address}</p>
                    <button className="outline outline-[#8DBE95] text-yellow-500 py-1 px-6 mt-2 rounded-[5px]">
                        Navigate
                    </button>
                </div>
            </div>

            {/* Leave a Review */}
            <div className='mb-3'>
                <h2 className='font-bold'>Leave a Review</h2>
                <p>Select the face which shows how you feel about the above Seller</p>
                <EmojiPicker />
            </div>

            <div className='mb-2'>
                <TextArea placeholder={'Enter additional comments here...'} />
            </div>

            <div className='mb-2'>
                <FileInput
                    label={'Optional feedback photo upload'}
                    handleAddImages={handleAddImages}
                    images={previewImage}
                />
            </div>

            {/* Save Button */}
            <div className='mb-7'>
                <button
                className="px-4 py-1 bg-[#386F4F] opacity-50 hover:opacity-100 text-white rounded-md flex justify-right ms-auto text-[15px]"
                >
                    Save
                </button>
            </div>

            {/* Summary of Reviews */}
            <div className='mb-7'>
                <h2 className='font-bold mb-2'>Reviews</h2>
                {/* Trust-O-meter */}
                <div className='mb-2'>                    
                    <TrustMeter ratings={itemData.seller.ratings} />
                </div>
                <div className='flex gap-3 mb-5 font-bold'>
                    <p className='text-sm'>Review Score: {itemData.seller.ratings} out of 5.0</p>
                    <button 
                    className="outline outline-[#8DBE95] text-[#8DBE95] btn-span py-1 px-5 w-full rounded-[5px] ms-auto"
                    >Check Reviews
                    </button>
                </div>
                <EmojiPicker reviews={itemData.seller.reviews} clickDisabled={true} />
            </div>

        </div>
    );
}
