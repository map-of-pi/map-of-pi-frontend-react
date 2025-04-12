'use client';

import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/shared/Forms/Buttons/Buttons";
import { Input, Select, TextArea } from "@/components/shared/Forms/Inputs/Inputs";
import { FulfillmentType, OrderItemStatus, OrderItemType, PartialOrderType, PickedItems, SellerItem } from "@/constants/types";
import { fetchOrderById, updateCompletedOrder, updateOrderItemStatus } from "@/services/orderApi";
import logger from '../../../../../../logger.config.mjs';
import Skeleton from "@/components/skeleton/skeleton";

export default function ReviewOrderItemPage({ params, searchParams }: { params: { id: string }, searchParams: { user_name: string, seller_type: string } }) {
  const HEADER = 'font-bold text-lg md:text-2xl';
  const SUBHEADER = 'font-bold mb-2';
  
  const locale = useLocale();
  const t = useTranslations();

  const orderId = params.id;
  const sellerName = searchParams.user_name;

  const [currentOrder, setCurrentOrder] = useState<PartialOrderType | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItemType[]>([]);
  const [buyerName, setBuyerName] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getOrder= async (id: string) => {
      try {
        setLoading(true)
        const data = await fetchOrderById(id);
        if (data) {
          setCurrentOrder(data.order);
          setOrderItems(data.orderItems);
          setBuyerName(data.pi_username);
        } else {
          setCurrentOrder(null);
          setOrderItems([]);
          setBuyerName('');
        }
      } catch (error) {
        logger.error('Error fetching seller items data:', error);
      }finally {
        setLoading(false);
      }
    };
    
    getOrder(orderId);
  }, [orderId]);

    const translateSellerCategory = (category: string): string => {
      switch (category) {
        case 'activeSeller':
          return t(
            'SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.ACTIVE_SELLER',
          );
        case 'inactiveSeller':
          return t(
            'SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.INACTIVE_SELLER',
          );
        case 'testSeller':
          return t(
            'SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.TEST_SELLER',
          );
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
      <Skeleton type="seller_review" />
    );
  }

  return (
    <div className="w-full md:w-[500px] md:mx-auto p-4">
      <div className="text-center mb-5">
        <h3 className="text-gray-400 text-sm">
          {sellerName}
        </h3>
        <h1 className={HEADER}>
          {"Buyer Order Details"}
        </h1>
      </div>

      <h2 className={SUBHEADER}>
      {t('SCREEN.SELLER_ORDER_FULFILLMENT.ORDER_SUBHEADER')}
      </h2>
      {currentOrder && <div className={`relative outline outline-50 outline-gray-600 rounded-lg mb-7`}
      >
        <div className="p-3">
          <div className="flex gap-x-4">
            <div className="flex-auto w-64">
              <Input
                label={'Seller:'}
                name="name"
                type="text"
                value={buyerName}
                disabled={true}
              />
            </div>

            <div className="flex-auto w-32">
              <div className="flex items-center gap-2">
                <Input
                  label={t('SCREEN.SELLER_ORDER_FULFILLMENT.ORDER_HEADER_ITEMS_FEATURE.TOTAL_PRICE_LABEL')}
                  name="Total price"
                  type="number"
                  value={currentOrder.total_amount.$numberDecimal || currentOrder.total_amount.$numberDecimal.toString()}
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
                {currentOrder?.createdAt && (
                  <label className="text-[14px] text-[#333333]">
                    { new Intl.DateTimeFormat(locale || 'en-US', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                    }).format(new Date(currentOrder.createdAt))}
                  </label>
                )}
              </div>
            </div>
            <div className="flex-auto w-32">
              <Input
                label={'Status:'}
                name="status"
                type="text"
                value={currentOrder.status || 'Pending'}
                disabled={true}
              />
            </div>                 
                  
          </div>

        </div>
      </div>}

      <h2 className={SUBHEADER}>
        Ordered Items:
      </h2>
      <div className="max-h-[600px] overflow-y-auto p-1 mb-4 mt-3">
        {orderItems && orderItems.length>0 && orderItems.map((item, index)=>(<div
          data-id={item._id}
          className={`relative outline outline-50 outline-gray-600 rounded-lg mb-7 ${
            item.status===OrderItemStatus.Fulfilled || item.status===OrderItemStatus.Refunded? 
            'bg-yellow-100' : ''
          }`}
          key={index}
        >
          <div className="p-3">
            <div className="flex gap-x-4">
              <div className="flex-auto w-64">
                <Input
                  label={t('SCREEN.BUY_FROM_SELLER.ONLINE_SHOPPING.SELLER_ITEMS_FEATURE.ITEM_LABEL') + ':'}
                  name="name"
                  type="text"
                  value={item.seller_item_id.name}
                  disabled={true}
                />
              </div>

              <div className="flex-auto w-32">
                <div className="flex items-center gap-2">
                  <Input
                    label={'Amount:'}
                    name="price"
                    type="number"
                    value={item.subtotal.$numberDecimal || item.subtotal.$numberDecimal.toString()}
                    disabled={true}
                  />
                  <p className="text-gray-500 text-sm">Pi</p>
                </div>
              </div>
            </div>

            <div className="flex gap-x-4">
              <div className="flex-auto w-64">
                <TextArea
                  label={t('SCREEN.BUY_FROM_SELLER.ONLINE_SHOPPING.SELLER_ITEMS_FEATURE.DESCRIPTION_LABEL') + ':'}
                  name="description"
                  value={item.seller_item_id.description}
                  disabled={true}
                  styles={{ maxHeight: '100px' }}
                />
              </div>
              <div className="flex-auto w-32 gap-2">
                <label className="block text-[17px] text-[#333333]">
                  {t('SCREEN.BUY_FROM_SELLER.ONLINE_SHOPPING.SELLER_ITEMS_FEATURE.PHOTO') + ':'}
                </label>
                <Image
                  src={item.seller_item_id.image || ''}
                  height={50}
                  width={50}
                  alt="image"
                  className={'h-[100px] w-auto'}
                />
              </div>
            </div>

            <div className="flex items-center gap-x-5 w-full mt-2">
              <div className="flex-auto w-64 mr-2">
                <Input
                  label={"Quantity"}
                  name="quantity"
                  type="number"
                  value={item.quantity}
                  className="p-[10px] block rounded-xl border-[#BDBDBD] bg-transparent outline-0 text-center focus:border-[#1d724b] border-[2px] max-w-[100px]"
                  disabled={true}
                />
                
              </div> 
              <div className="flex-auto w-32">
                <Input
                  label={'Status:'}
                  name="Status"
                  type="text"
                  value={item.status}
                  className="p-[10px] block rounded-xl border-[#BDBDBD] bg-transparent outline-0 text-center focus:border-[#1d724b] border-[2px] max-w-[100px]"
                  disabled={true}
                />
              </div>
            </div>
          </div>
        </div>
        ))}
      </div>

      <div>
        <h2 className={SUBHEADER}>{t('SCREEN.SELLER_REGISTRATION.FULFILLMENT_METHOD_TYPE.FULFILLMENT_METHOD_TYPE_LABEL')}</h2>
        <Select
          name="fulfillment_method"
          options={translatedFulfillmentMethod}
          value={currentOrder?.fulfillment_method}
          disabled={true}
        />
        <h2 className={SUBHEADER}>{t('SCREEN.SELLER_REGISTRATION.FULFILLMENT_INSTRUCTIONS_LABEL')}</h2>
        <TextArea
          name="fulfillment_description"
          type="text"
          value={currentOrder?.seller_fulfillment_description}
          disabled
        />
        <h2 className={SUBHEADER}>{t('Buyer Fulfillment Details')}</h2>
        <TextArea
          name="buying_details"
          value={currentOrder?.buyer_fulfillment_description}
        />
      </div>
    </div>
  );
};
