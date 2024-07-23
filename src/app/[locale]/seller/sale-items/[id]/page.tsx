'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import React, { useEffect, useState, useContext } from 'react';

import { AppContext } from '../../../../../../context/AppContextProvider';
import TrustMeter from '@/components/shared/Review/TrustMeter';
import EmojiPicker from '@/components/shared/Review/emojipicker';
import { OutlineBtn } from '@/components/shared/Forms/Buttons/Buttons';
import ConfirmDialog from '@/components/shared/confirm';
import { PiFestJson } from '@/constants/demoAPI';
import Skeleton from '@/components/skeleton/skeleton';
import { fetchSingleSeller } from '@/services/api';

export default function Page({ params }: { params: { id: string } }) {
  const SUBHEADER = "font-bold mb-2";

  const t = useTranslations();
  const router = useRouter();

  const sellerId = params.id; 

  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const [seller, setSeller] = useState(PiFestJson.Seller);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, autoLoginUser, registerUser } = useContext(AppContext);

  useEffect(() => {
    const getSellerData = async () => {
      try {
        const data = await fetchSingleSeller(sellerId); //'testme'
        setSeller(data);  // Ensure this is a single object, not an array
      } catch (error) {
        setError('Error fetching seller data');
      } finally {
        setLoading(false);
      }
    };
    getSellerData();

    // try re-login user if not current user auth
    const token = localStorage.getItem('mapOfPiToken');
    if (!token) {
      console.log("Not logged in; pending login..");
      registerUser();
    } else {
      if (!currentUser) {
        autoLoginUser();
        console.log("Logged in");
      }
    }

  }, [currentUser]);

  const handleNavigation = (route: string) => {
    if (isSaveEnabled) {
      setLinkUrl(route);
      setShowConfirmDialog(true);
    } else {
      router.push(`/${route}`);
    }
  };

  const translateSellerCategory = (category: string): string => {
    switch (category) {
      case 'Pioneer':
        return t('SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.PIONEER');
      case 'Other':
        return t('SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.OTHER');
      default:
        return category;
    }
  };

  // loading condition
  if (loading) {
    return (
      <Skeleton type="seller_item" />
    );
  }

  return (
    <>
    <div className="w-full md:w-[500px] md:mx-auto p-4">
      <h1 className="mb-5 font-bold text-lg md:text-2xl">{t('SCREEN.BUY_FROM_SELLER.BUY_FROM_SELLER_HEADER')}</h1>

      {seller && (<div>
        {/* Seller Profile */}
        <div className="flex gap-4 align-center mb-6 relative">
          <div className="rounded-[50%] w-[65px] h-[65px] relative">
            <Image alt="seller logo" src={seller.image} fill={true} className="rounded-[50%]" />
          </div>
          <div className="my-auto">
            <h2 className="font-bold mb-2">{seller.name}</h2>
            <p className="text-sm">{translateSellerCategory('Pioneer')}</p>
          </div>
        </div>

        {/* Seller Description */}
        <div className="mb-5">
          <h2 className={SUBHEADER}>{t('SCREEN.BUY_FROM_SELLER.SELLER_DESCRIPTION_LABEL')}</h2>
          <p className="">{seller.description}</p>
        </div>

        {/* Items List */}
        <h2 className={SUBHEADER}>{t('SCREEN.BUY_FROM_SELLER.SELLER_SALE_ITEMS_LABEL')}</h2>
        <div className="seller_item_container mb-6">
          <p>{seller.sale_items}</p>
        </div>

        {/* Seller Location */}
        <div className="mb-6">
          <h2 className={`SUBHEADER`}>{t('SCREEN.BUY_FROM_SELLER.SELLER_ADDRESS_LOCATION_LABEL')}</h2>
          <p className="mb-3">{seller.address}</p>
          <OutlineBtn label={t('SHARED.NAVIGATE')} onClick={() => handleNavigation('')} />
        </div>

        <div>
          <EmojiPicker sellerId={sellerId} setIsSaveEnabled={setIsSaveEnabled} currentUser={currentUser} />
        </div>

        {/* Summary of Reviews */}
        <div className="mb-7">
          <h2 className={SUBHEADER}>{t('SCREEN.BUY_FROM_SELLER.REVIEWS_SUMMARY_LABEL')}</h2>
          {/* Trust-O-meter */}
          <div>
            <TrustMeter ratings={seller.trust_meter_rating} />
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm">
              {t('SCREEN.BUY_FROM_SELLER.REVIEWS_SCORE_MESSAGE', {seller_review_rating: seller.average_rating.$numberDecimal})}
            </p>
            <Link href={`/seller/reviews/${sellerId}?buyer=true&seller_name=${seller.name}`}>
            <OutlineBtn label={t('SHARED.CHECK_REVIEWS')} />
            </Link>
          </div>
        </div>
        <div className="mb-7">
          <h2 className={`${SUBHEADER} mb-4`}>{t('SCREEN.BUY_FROM_SELLER.SELLER_CONTACT_DETAILS_LABEL')}</h2>
          <div className="text-sm mb-3">
            <span className="font-bold">{t('SCREEN.BUY_FROM_SELLER.SELLER_PI_ID_LABEL') + ": "}</span>
            <span>{seller.seller_id}</span>
          </div>
          <div className="text-sm mb-3">
            <span className="font-bold">{t('SCREEN.BUY_FROM_SELLER.SELLER_PHONE_LABEL') + ": "}</span>
            <span>{seller.phone}</span>
          </div>
          <div className="text-sm mb-3">
            <span className="font-bold">{t('SCREEN.BUY_FROM_SELLER.SELLER_EMAIL_LABEL') + ": "}</span>
            <span>{seller.email}</span>
          </div>
        </div>
        
        <ConfirmDialog
          show={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={setShowConfirmDialog}
          message={t('SHARED.CONFIRM_DIALOG')}
          url={linkUrl}
        />
      </div>
      )}
    </div>  
    </>
  );
}
