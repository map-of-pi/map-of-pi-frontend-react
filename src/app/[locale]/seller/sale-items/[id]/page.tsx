'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import React, { useEffect, useState, useContext, useRef, ChangeEvent } from 'react';

import ConfirmDialog from '@/components/shared/confirm';
import { Button, OutlineBtn } from '@/components/shared/Forms/Buttons/Buttons';
import TrustMeter from '@/components/shared/Review/TrustMeter';
import ToggleCollapse from '@/components/shared/Seller/ToggleCollapse';
import Skeleton from '@/components/skeleton/skeleton';
import { ISeller, IUserSettings, IUser, SellerItem, PaymentDataType, PickedItems, FulfillmentType } from '@/constants/types';
import { fetchSellerItems, fetchSingleSeller } from '@/services/sellerApi';
import { fetchSingleUserSettings } from '@/services/userSettingsApi';
import { fetchToggle } from '@/services/toggleApi';
import { checkAndAutoLoginUser } from '@/utils/auth';

import { AppContext } from '../../../../../../context/AppContextProvider';
import logger from '../../../../../../logger.config.mjs';
import { ListItem } from '@/components/shared/Seller/ShopItem';
import { Select, TextArea } from '@/components/shared/Forms/Inputs/Inputs';
import { payWithPi } from '@/config/payment';

export default function BuyFromSellerForm({ params }: { params: { id: string } }) {
  const SUBHEADER = "font-bold mb-2";
  const t = useTranslations();
  const locale = useLocale();
  const sellerId = params.id; 

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [sellerShopInfo, setSellerShopInfo] = useState<ISeller | null>(null);
  const [sellerSettings, setSellerSettings] = useState<IUserSettings | null>(null);
  const [sellerInfo, setSellerInfo] = useState<IUser | null>(null);
  const [dbSellerItems, setDbSellerItems] = useState<SellerItem[] | null>(null)
  const [totalAmount, setTotalAmount] = useState<number>(0.00);
  const [buyerDescription, setBuyerDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, autoLoginUser } = useContext(AppContext);
  const [pickedItems, setPickedItems] = useState<{ itemId: string; quantity: number }[]>([]);
  const [isOnlineShoppingEnabled, setOnlineShoppingEnabled] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);

  const handleShopItemRef = (node: HTMLElement | null) => {
    if (node && observer.current) {
      observer.current.observe(node);
    }
  };
  
  useEffect(() => {
    checkAndAutoLoginUser(currentUser, autoLoginUser);
    
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
        logger.error(`Error fetching seller data for seller ID: ${ sellerId }`, error);
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
        logger.error(`Error fetching seller settings for seller ID: ${ sellerId }`, error);
        setError('Error fetching seller settings');
      }
    };

    const getToggleData = async () => {
      try {
        const toggle = await fetchToggle('onlineShoppingFeature');
        setOnlineShoppingEnabled(toggle.enabled);
      } catch (error) {
        logger.error('Error fetching toggle:', error);
      }
    };

    getSellerData();
    getSellerSettings();
    getToggleData();
  }, []);

   // Fetch seller items
  useEffect(() => {
    const getSellerItems = async (seller_id: string) => {
      try {
        const items = await fetchSellerItems(seller_id);
        if (items) {
          setDbSellerItems(items);
        } else {
          setDbSellerItems(null);
        }
      } catch (error) {
        logger.error('Error fetching seller items data:', error);
      }
    };
    
    if (sellerShopInfo){
      getSellerItems(sellerShopInfo.seller_id);
    }
  }, [sellerShopInfo]); 

  const checkoutOrder = async () => {
    if(!currentUser?.pi_uid) return setError('user not login for payment');
    const paymentData: PaymentDataType = {
      amount: totalAmount,
      memo: 'This is another Test Payment',
      uid: currentUser.pi_uid,
      metadata: { 
        buyer: currentUser.pi_uid, 
        seller: sellerId,
        items: pickedItems,
        amount: totalAmount,
        fulfillment_method: sellerShopInfo?.fulfillment_method,
        seller_fulfillment_description: sellerShopInfo?.fulfillment_description,
        buyer_fulfillment_description: buyerDescription,
      },
    };
    await payWithPi(paymentData)
  }  

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

  const translatedFulfillmentMethod = [
    {
      value: FulfillmentType.CollectionByBuyer,
      name: t(
        'SCREEN.SELLER_REGISTRATION.FULFILLMENT_METHOD_TYPE.FULFILLMENT_METHOD_TYPE_OPTIONS.COLLECTION_BY_BUYER',
      ),
    },
    {
      value: FulfillmentType.DeliveredToBuyer,
      name: t(
        'SCREEN.SELLER_REGISTRATION.FULFILLMENT_METHOD_TYPE.FULFILLMENT_METHOD_TYPE_OPTIONS.DELIVERED_TO_BUYER',
      ),
    },
  ];

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
              src={sellerShopInfo.image && sellerShopInfo.image.trim() !== "" ? sellerShopInfo.image : 'images/logo.svg' } 
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

        {/* Seller Details/Description */}
        <h2 className={SUBHEADER}>{t('SCREEN.BUY_FROM_SELLER.SELLER_DETAILS_LABEL')}</h2>
        <div className="seller_item_container">          

          {/* Seller's description with line breaks */}
          <div className="seller-description-display">
            <p className='mb-5' style={{ whiteSpace: 'pre-wrap' }}>
              {sellerShopInfo.description}
            </p>
          </div>
        </div>

        {/* Seller Address/ Position */}
        <h2 className={SUBHEADER}>{t('SCREEN.BUY_FROM_SELLER.SELLER_ADDRESS_POSITION_LABEL')}</h2>
        <div className="seller_item_container mb-5">          
          <p className='mb-3' style={{ whiteSpace: 'pre-wrap' }}>
            {sellerShopInfo.address}
          </p>          
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
            <Link href={`/${locale}/seller/reviews/${sellerId}?buyer=true&user_name=${sellerInfo?.pi_username}`}>
            <OutlineBtn label={t('SHARED.CHECK_REVIEWS')} />
            </Link>
          </div>
        </div>
        
        {/* Online Shopping */}
        {isOnlineShoppingEnabled && (
          <ToggleCollapse
            header={t('SCREEN.SELLER_REGISTRATION.SELLER_ONLINE_SHOPPING_ITEMS_LIST_LABEL')}
            open={false}>
            <div className="max-h-[600px] overflow-y-auto p-1 mb-7 mt-3">
              {dbSellerItems && dbSellerItems.length > 0 && 
                dbSellerItems.map((item) => (
                  <ListItem
                    key={item._id}
                    item={item}
                    pickedItems={pickedItems}
                    setPickedItems={setPickedItems}
                    refCallback={handleShopItemRef} // Attach observer
                    totalAmount={totalAmount}
                    setTotalAmount={setTotalAmount}
                  /> 
                ))            
              }
            </div>
            <div>
              <h2 className={SUBHEADER}>{t('SCREEN.SELLER_REGISTRATION.FULFILLMENT_METHOD_TYPE.FULFILLMENT_METHOD_TYPE_LABEL')}</h2>
              <Select
                name="fulfillment_method"
                options={translatedFulfillmentMethod}
                value={sellerShopInfo.fulfillment_method}
                disabled={true}
              />
              <h2 className={SUBHEADER}>{t('SCREEN.SELLER_REGISTRATION.FULFILLMENT_INSTRUCTIONS_LABEL')}</h2>
              <TextArea
                name="fulfillment_description"
                type="text"
                value={sellerShopInfo.fulfillment_description}
                disabled
              />
              <h2 className={SUBHEADER}>{t('Buyer Fulfillment Details')}</h2>
              <TextArea
                name="buying_details"
                value={buyerDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBuyerDescription(e.target.value)}
              />
            </div>
            <div className="mb-4 mt-3 ml-auto">
              <Button
                label={t('Checkout ') + `(${totalAmount.toString()} Pi)`}
                disabled={!(pickedItems.length>0)}
                styles={{
                  color: '#ffc153',
                  height: '40px',
                  padding: '15px 20px',
                  marginLeft: 'auto'
                }}
                onClick={()=>checkoutOrder()}
              />
            </div>
          </ToggleCollapse>
        )}

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
