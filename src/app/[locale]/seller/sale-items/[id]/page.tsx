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
import Skeleton from '@/components/skeleton/skeleton';
import { fetchSingleSeller } from '@/services/sellerApi';
import { ISeller, IUserSettings, IUser } from '@/constants/types';
import ToggleCollapse from '@/components/shared/Seller/ToggleCollapse';
import { fetchSellerSettings } from '@/services/userSettingsApi';

export default function Page({ params }: { params: { id: string } }) {
  const SUBHEADER = "font-bold mb-2";

  const t = useTranslations();
  const router = useRouter();

  const sellerId = params.id; 

  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const [seller, setSeller] = useState<ISeller | null>(null);
  const [sellerSettings, setSellerSettings] = useState<IUserSettings | null>(null);
  const [sellerUser, setSellerUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, autoLoginUser } = useContext(AppContext);

  useEffect(() => {
    // try re-login user if not current user auth
    if (!currentUser) {
      console.log("Not logged in; pending login attempt..");
      autoLoginUser();
    };
    
    const getSellerData = async () => {
      try {
        const data = await fetchSingleSeller(sellerId); //'testme'
        setSeller(data.business_info);  // Ensure this is a single object, not an array
        if (data.seller_settings) {
          setSellerSettings(data.seller_settings);
        } else {
          setSellerSettings(null);
        }
        if (data.user) {
          setSellerUser(data.user);
        } else {
          setSellerUser(null);
        }
      } catch (error) {
        setError('Error fetching seller data');
      } finally {
        setLoading(false);
      }
    };

    const getSellerSettings = async () => {
      const settings = await fetchSellerSettings(sellerId);
      console.log("User settings:", settings);
      
    };

    getSellerData();
    getSellerSettings();

    
  }, []);

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
      <h1 className="mb-5 text-center font-bold text-lg md:text-2xl">{t('SCREEN.BUY_FROM_SELLER.BUY_FROM_SELLER_HEADER')}</h1>

      {seller && (<div>
        {/* Seller Profile */}
        <div className="flex gap-4 align-center mb-6 relative">
          <div className="rounded-[50%] w-[65px] h-[65px] relative">
            <Image alt="seller logo" src={seller.image} fill={true} className="rounded-[50%]" />
          </div>
          <div className="my-auto">
            <h2 className="font-bold mb-2">{seller.name}</h2>
            <p className="text-sm">{translateSellerCategory(seller.seller_type)}</p>
          </div>
        </div>

        {/* Seller Description */}
        <h2 className={SUBHEADER}>{t('Seller Details')}</h2>
        <div className="seller_item_container mb-5">          
          <p className="mb-3">{seller.description}</p>
        </div>

        {/* Seller Location */}
        <h2 className={SUBHEADER}>{t('Seller Address or Whereabout')}</h2>
        <div className="seller_item_container mb-5">          
          <p className="mb-3">{seller.address}</p>          
        </div>

          {/* Summary of Reviews */}
        <div className="mb-7 mt-5">
          <h2 className={SUBHEADER}>{t('SCREEN.BUY_FROM_SELLER.REVIEWS_SUMMARY_LABEL')}</h2>
          {/* Trust-O-meter */}
          <div>
            <TrustMeter ratings={seller.trust_meter_rating} />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm">
              {t('SCREEN.BUY_FROM_SELLER.REVIEWS_SCORE_MESSAGE', {seller_review_rating: seller.average_rating.$numberDecimal})}
            </p>
            <Link href={`/seller/reviews/${sellerId}?buyer=true&seller_name=${seller.name}`}>
            <OutlineBtn label={t('SHARED.CHECK_REVIEWS')} />
            </Link>
          </div>
        </div>

        <ToggleCollapse
          header={t('SCREEN.BUY_FROM_SELLER.LEAVE_A_REVIEW_MESSAGE')}>
            {/* <h2 className={SUBHEADER}>{t('SCREEN.BUY_FROM_SELLER.LEAVE_A_REVIEW_MESSAGE')}</h2> */}
          <div>
            <EmojiPicker sellerId={sellerId} setIsSaveEnabled={setIsSaveEnabled} currentUser={currentUser} />
          </div>
        </ToggleCollapse>

          
        <ToggleCollapse
          header={t('SCREEN.BUY_FROM_SELLER.SELLER_CONTACT_DETAILS_LABEL')}>
          <div className="text-sm mb-3">
            <span className="font-bold">
              {t('Username') + ': '}
            </span>
            <span>{sellerUser ? sellerUser.user_name : ''}</span>
          </div>
          <div className="text-sm mb-3">
            <span className="font-bold">
              {t('Pioneer Name') + ': '}
            </span>
            <span>{sellerUser ? sellerUser.pi_username: ''}</span>
          </div>
          <div className="text-sm mb-3">
            <span className="font-bold">
              {t('Phone') + ': '}
            </span>
            <span>{sellerSettings ? sellerSettings.phone_number : ""}</span>
          </div>
          <div className="text-sm mb-3">
            <span className="font-bold">
              {t('Email') + ': '}
            </span>
            <span>{ sellerSettings ? sellerSettings.email : ""}</span>
          </div>
        </ToggleCollapse>
        
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
