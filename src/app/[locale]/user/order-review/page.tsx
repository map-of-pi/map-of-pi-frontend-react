'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import React, { useEffect, useState, useContext, useRef } from 'react';

import Skeleton from '@/components/skeleton/skeleton';
import { ISeller, IUserSettings, IUser, SellerItem, PartialOrderType, OrderStatusType } from '@/constants/types';
import { fetchSellerItems, fetchSingleSeller } from '@/services/sellerApi';
import { fetchSingleUserSettings } from '@/services/userSettingsApi';
import { fetchToggle } from '@/services/toggleApi';
import { checkAndAutoLoginUser } from '@/utils/auth';

import { AppContext } from '../../../../../context/AppContextProvider';
import logger from '../../../../../logger.config.mjs';
import { ListOrder } from '@/components/shared/Seller/OrderList';
import { fetchOrderList } from '@/services/orderApi';
import { Input } from '@/components/shared/Forms/Inputs/Inputs';
import { Button } from '@/components/shared/Forms/Buttons/Buttons';

export default function OrderReviewPage({ params }: { params: { id: string } }) {
  const SUBHEADER = "font-bold mb-2";
  const locale = useLocale();

  const [loading, setLoading] = useState<boolean>(true);
  const { currentUser } = useContext(AppContext);


  const HEADER = 'font-bold text-lg md:text-2xl';
  const [orderList, setOrderList] = useState<PartialOrderType[] >([]);
  
     useEffect(() => {
      const getOrderList= async (id: string) => {
        setLoading(true);
        try {
          const data = await fetchOrderList(id);
          if (data) {
            setOrderList(data);
          } else {
            setOrderList([]);
          }
        } catch (error) {
          logger.error('Error fetching seller items data:', error);
        }finally {
          setLoading(false);
        }
      };
      
      getOrderList(currentUser?.pi_uid as string);
    }, [currentUser?.pi_uid]); 

  // loading condition
  if (loading) {
    logger.info('Loading seller data..');
    return (
      <Skeleton type="seller_review" />
    );
  }

  return (
    <>
    <div className="w-full md:w-[500px] md:mx-auto p-4">
      <div className="text-center mb-7">
        <h3 className="text-gray-400 text-sm">
          {currentUser?.user_name ||""}
        </h3>
        <h1 className={HEADER}>
          {'Buyer Order List'}
        </h1>
      </div>

      {/* Review Order | Online Shopping */}
      <div>
        {orderList && orderList.length>0 && orderList.map((item, index)=>(
          <Link href={`/${locale}/user/order-item/${item._id}?user_name=${currentUser?.user_name}`} key={index} > 
            <div
              data-id={item._id}            
              className={`relative outline outline-50 outline-gray-600 rounded-lg mb-7 ${item.status===OrderStatusType.Completed ? 'bg-yellow-100' : item.status===OrderStatusType.Cancelled? 
              'bg-red-100' : ''}`}
            >
              <div className="p-3">
                <div className="flex gap-x-4">
                  <div className="flex-auto w-64">
                    <Input
                      label={'Seller:'}
                      name="name"
                      type="text"
                      value={item.buyer_id.pi_username}
                      disabled={true}
                    />
                  </div>
        
                  <div className="flex-auto w-32">
                    <div className="flex items-center gap-2">
                      <Input
                        label={'Total Price:'}
                        name="price"
                        type="number"
                        value={item.total_amount.$numberDecimal || item.total_amount.$numberDecimal.toString()}
                        disabled={true}
                      />
                      <p className="text-gray-500 text-sm">Pi</p>
                    </div>
                  </div>
                </div>
                <div>
                </div>
                
                <div className="flex gap-x-4 w-full mt-1">
                  <div className="flex-auto w-64">
                    <label className="block text-[17px] text-[#333333] mb-1">Time of order:</label>
                    <div
                      className={`p-[10px] block rounded-xl border-[#BDBDBD] bg-transparent outline-0 focus:border-[#1d724b] border-[2px] w-full mb-2`}
                    >
                      {item?.createdAt && (
                        <label className="text-[14px] text-[#333333]">
                          { new Intl.DateTimeFormat(locale || 'en-US', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                          }).format(new Date(item.createdAt))}
                        </label>
                      )}
                    </div>
                  </div>
                  <div className="flex-auto w-32">
                    <Input
                      label={'Status:'}
                      name="status"
                      type="text"
                      value={item.status || 'Pending'}
                      disabled={true}
                    />
                  </div>                 
                        
                </div>
              </div>
            </div>
          </Link>
        ))}      
      </div>
    </div>  
    </>
  );
}
