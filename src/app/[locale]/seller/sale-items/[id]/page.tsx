'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import React, { useEffect, useState, useContext } from 'react';

import { AppContext } from '../../../../../../context/AppContextProvider';
import ConfirmDialog from '@/components/shared/confirm';
import { OutlineBtn } from '@/components/shared/Forms/Buttons/Buttons';
import EmojiPicker from '@/components/shared/Review/emojipicker';
import TrustMeter from '@/components/shared/Review/TrustMeter';
import ToggleCollapse from '@/components/shared/Seller/ToggleCollapse';
import Skeleton from '@/components/skeleton/skeleton';
import { ISeller, IUserSettings, IUser } from '@/constants/types';
import { fetchSingleSeller } from '@/services/sellerApi';
import { fetchSingleUserSettings } from '@/services/userSettingsApi';

import logger from '../../../../../../logger.config.mjs';

export default function BuyFromSellerForm({ params }: { params: { id: string } }) {
  const SUBHEADER = "font-bold mb-2";

  const t = useTranslations();

  const sellerId = params.id; 

  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const [sellerShopInfo, setSellerShopInfo] = useState<ISeller | null>(null);
  const [sellerSettings, setSellerSettings] = useState<IUserSettings | null>(null);
  const [sellerInfo, setSellerInfo] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, autoLoginUser } = useContext(AppContext);

  useEffect(() => {
    if (!currentUser) {
      logger.info("User not logged in; attempting auto-login..");
      autoLoginUser();
    };
    
    const getSellerData = async () => {
      try {
        logger.info(`Fetching seller data for seller ID: ${sellerId}`);
        const data = await fetchSingleSeller(sellerId);
        setSellerShopInfo(data.sellerShopInfo);
        setSellerSettings(data.sellerSettings);
        setSellerInfo(data.sellerInfo);

        if (data.sellerShopInfo) {
          logger.info(`Fetched seller shop info successfully for seller ID: ${sellerId}`);
        } else {
          logger.warn(`No seller shop info found for seller ID: ${sellerId}`);
        }
      } catch (error) {
        logger.error(`Error fetching seller data for seller ID: ${ sellerId }`, { error });
        setError('Error fetching seller data');
      } finally {
        setLoading(false);
      }
    };

    const getSellerSettings = async () => {
      try {
        logger.info(`Fetching seller settings for seller ID: ${sellerId}`);
        const settings = await fetchSingleUserSettings(sellerId);

        if (settings) {
          logger.info(`Fetched seller settings successfully for seller ID: ${sellerId}`);
        } else {
          logger.warn(`No seller settings found for seller ID: ${sellerId}`);
        }
      } catch (error) {
        logger.error(`Error fetching seller settings for seller ID: ${ sellerId }`, { error });
        setError('Error fetching seller settings');
      }
    };

    getSellerData();
    getSellerSettings();
    
  }, []);

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
    logger.info('Loading seller data..');
    return (
      <Skeleton type="seller_item" />
    );
  }

  return (
    <>
    <div className="w-full md:w-[500px] md:mx-auto p-4">
      <h1 className="mb-5 text-center font-bold text-lg md:text-2xl">{t('SCREEN.BUY_FROM_SELLER.BUY_FROM_SELLER_HEADER')}</h1>

      {sellerShopInfo && (<div>
        {/* Seller Profile */}
        <div className="flex gap-4 align-center mb-6 relative">
          <div className="rounded-[50%] w-[65px] h-[65px] relative">
            <Image 
              className="rounded-[50%]" 
              src={sellerShopInfo.image && sellerShopInfo.image.trim() !== "" ? sellerShopInfo.image : process.env.NEXT_PUBLIC_IMAGE_PLACEHOLDER_URL || '/images/shared/upload.png'} 
              alt="seller logo" 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover', maxHeight: '200px', maxWidth: '100%' }}
            />
          </div>
          <div className="my-auto">
            <h2 className="font-bold mb-2">{sellerShopInfo.name}</h2>
            <p className="text-sm">{translateSellerCategory(sellerShopInfo.seller_type)}</p>
          </div>
        </div>

        {/* Seller Details/ Description */}
        <h2 className={SUBHEADER}>{t('SCREEN.BUY_FROM_SELLER.SELLER_DETAILS_LABEL')}</h2>
        <div className="seller_item_container mb-5">          
          <p className="mb-3">{sellerShopInfo.description}</p>
        </div>

        {/* Seller Address/ Position */}
        <h2 className={SUBHEADER}>{t('SCREEN.BUY_FROM_SELLER.SELLER_ADDRESS_POSITION_LABEL')}</h2>
        <div className="seller_item_container mb-5">          
          <p className="mb-3">{sellerShopInfo.address}</p>          
        </div>

          {/* Summary of Reviews */}
        <div className="mb-7 mt-5">
          <h2 className={SUBHEADER}>{t('SCREEN.BUY_FROM_SELLER.REVIEWS_SUMMARY_LABEL')}</h2>
          {/* Trust-O-meter */}
          <div>
            <TrustMeter ratings={sellerSettings ? sellerSettings.trust_meter_rating : 100} />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm">
              {t('SCREEN.BUY_FROM_SELLER.REVIEWS_SCORE_MESSAGE', {seller_review_rating: sellerShopInfo.average_rating.$numberDecimal})}
            </p>
            <Link href={`/seller/reviews/${sellerId}?buyer=true&seller_name=${sellerShopInfo.name}`}>
            <OutlineBtn label={t('SHARED.CHECK_REVIEWS')} />
            </Link>
          </div>
        </div>
          
        <ToggleCollapse
          header={t('SCREEN.BUY_FROM_SELLER.SELLER_CONTACT_DETAILS_LABEL')}>
          <div className="text-sm mb-3">
            <span className="font-bold">
              {t('SHARED.USER_INFORMATION.PI_USERNAME_LABEL') + ': '}
            </span>
            <span>{sellerInfo ? sellerInfo.pi_username: ''}</span>
          </div>
          <div className="text-sm mb-3">
            <span className="font-bold">
              {t('SHARED.USER_INFORMATION.NAME_LABEL') + ': '}
            </span>
            <span>{sellerInfo ? sellerInfo.user_name : ''}</span>
          </div>
          <div className="text-sm mb-3">
            <span className="font-bold">
              {t('SHARED.USER_INFORMATION.PHONE_NUMBER_LABEL') + ': '}
            </span>
            <span>{sellerSettings ? sellerSettings.phone_number : ""}</span>
          </div>
          <div className="text-sm mb-3">
            <span className="font-bold">
              {t('SHARED.USER_INFORMATION.EMAIL_LABEL') + ': '}
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
