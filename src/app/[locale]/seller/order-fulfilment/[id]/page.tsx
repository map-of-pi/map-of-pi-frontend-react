'use client';

import { Button } from "@/components/shared/Forms/Buttons/Buttons";
import { Input, Select, TextArea } from "@/components/shared/Forms/Inputs/Inputs";
import { FulfillmentType, OrderItemStatus, OrderItemType, PartialOrderType, PickedItems, SellerItem } from "@/constants/types";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import logger from '../../../../../../logger.config.mjs';
import { fetchOrderById, updateOrderItemStatus } from "@/services/orderApi";


export default function OrderItemPage({ params, searchParams }: { params: { id: string }, searchParams: {seller_name: string, seller_type: string} }) {
  const t = useTranslations();
  const locale = useLocale();
  const orderId = params.id;
  const sellerName = searchParams.seller_name;
  const sellerType = searchParams.seller_type;

  const translatedStockLevelOptions = [
    { value: '1 available', name: t('SCREEN.SELLER_REGISTRATION.SELLER_ITEMS_FEATURE.STOCK_LEVEL_OPTIONS.AVAILABLE_1') },
    { value: '2 available', name: t('SCREEN.SELLER_REGISTRATION.SELLER_ITEMS_FEATURE.STOCK_LEVEL_OPTIONS.AVAILABLE_2') },
    { value: '3 available', name: t('SCREEN.SELLER_REGISTRATION.SELLER_ITEMS_FEATURE.STOCK_LEVEL_OPTIONS.AVAILABLE_3') },
    { value: 'Many available', name: t('SCREEN.SELLER_REGISTRATION.SELLER_ITEMS_FEATURE.STOCK_LEVEL_OPTIONS.MANY') },
    { value: 'Made to order', name: t('SCREEN.SELLER_REGISTRATION.SELLER_ITEMS_FEATURE.STOCK_LEVEL_OPTIONS.MADE_TO_ORDER') },
    { value: 'Ongoing service', name: t('SCREEN.SELLER_REGISTRATION.SELLER_ITEMS_FEATURE.STOCK_LEVEL_OPTIONS.ONGOING_SERVICE') },
    { value: 'Sold', name: t('SCREEN.SELLER_REGISTRATION.SELLER_ITEMS_FEATURE.STOCK_LEVEL_OPTIONS.SOLD') },
  ];

  const [currentOrder, setCurrentOrder] = useState<PartialOrderType | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItemType[]>([]);
  const [buyerName, setBuyerName] = useState<string>('');

  useEffect(() => {
    const getOrder= async (id: string) => {
      try {
        const data = await fetchOrderById(id);
        if (data) {
          setCurrentOrder(data.order);
          setOrderItems(data.orderItems);
          setBuyerName(data.pi_username)
        } else {
          setCurrentOrder(null);
          setOrderItems([]);
          setBuyerName('')
        }
      } catch (error) {
        logger.error('Error fetching seller items data:', error);
      }
    };
    
    getOrder(orderId);
  }, [orderId]);

  const HEADER = 'font-bold text-lg md:text-2xl';
  const SUBHEADER = 'font-bold mb-2';

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
  
    const handleFufill = async (itemId: string,) => {
      try {
        const updateItem = await updateOrderItemStatus(itemId, "fulfilled");
    
        if (updateItem) {
          setOrderItems((prev) => 
            prev.map((item) =>
              item._id === itemId ? { ...item, status: OrderItemStatus.Fulfilled } : item
            )
          );
        }
      } catch (error) {
        console.error("Error updating item status:", error);
      }
    };

  return (
    <div className="w-full md:w-[500px] md:mx-auto p-4">
      <div className="text-center mb-5">
        <h3 className="text-gray-400 text-sm">
          {sellerName}
        </h3>
        <h1 className={HEADER}>
          {'Seller Order Fulfillment'}
        </h1>
        <p className="text-gray-400 text-sm">
          {translateSellerCategory(sellerType)}
        </p>
      </div>

      <h2 className={SUBHEADER}>
        Order Header:
      </h2>
      {currentOrder && <div className={`relative outline outline-50 outline-gray-600 rounded-lg mb-7`}
      >
        <div className="p-3">
              <div className="flex gap-x-4">
                <div className="flex-auto w-64">
                  <Input
                    label={'Pioneer:'}
                    name="name"
                    type="text"
                    value={buyerName}
                    disabled={true}
                  />
                </div>

                <div className="flex-auto w-32">
                  <div className="flex items-center gap-2">
                    <Input
                      label={'Total Price:'}
                      name="price"
                      type="number"
                      value={currentOrder.total_amount || currentOrder.total_amount.toString()}
                      disabled={true}
                    />
                    <p className="text-gray-500 text-sm">Pi</p>
                  </div>
                </div>
              </div>
              <div>
              </div>
              <div className="flex items-center gap-4 w-full mt-1">
                <div
                className={`p-[10px] block rounded-xl border-[#BDBDBD] bg-transparent outline-0 focus:border-[#1d724b] border-[2px] w-full`}
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

        </div>
      </div>}

      <h2 className={SUBHEADER}>
        Ordered Items:
      </h2>
      <div className="max-h-[600px] overflow-y-auto p-1 mb-7 mt-3">
        {orderItems && orderItems.length>0 && orderItems.map((item, index)=>(<div
          data-id={item._id}
          className={`relative outline outline-50 outline-gray-600 rounded-lg mb-7${
            item.status==='fulfilled'? 'bg-yellow-100' : ''
          }`}
          key={index}
        >
          <div className="p-3">
            <div className="flex gap-x-4">
              <div className="flex-auto w-64">
                <Input
                  label={t('SCREEN.BUY_FROM_SELLER.SELLER_ITEMS_FEATURE.ITEM_LABEL') + ':'}
                  name="name"
                  type="text"
                  value={item.seller_item.name}
                  disabled={true}
                />
              </div>

              <div className="flex-auto w-32">
                <div className="flex items-center gap-2">
                  <Input
                    label={'Amount:'}
                    name="price"
                    type="number"
                    value={item.sub_total_amount || item.sub_total_amount.toString()}
                    disabled={true}
                  />
                  <p className="text-gray-500 text-sm">Pi</p>
                </div>
              </div>
            </div>

            <div className="flex gap-x-4">
              <div className="flex-auto w-64">
                <TextArea
                  label={t('SCREEN.BUY_FROM_SELLER.SELLER_ITEMS_FEATURE.DESCRIPTION_LABEL') + ':'}
                  name="description"
                  value={item.seller_item.description}
                  disabled={true}
                  styles={{ maxHeight: '100px' }}
                />
              </div>
              <div className="flex-auto w-32 gap-2">
                <label className="block text-[17px] text-[#333333]">
                  {t('SCREEN.BUY_FROM_SELLER.SELLER_ITEMS_FEATURE.PHOTO') + ':'}
                </label>
                <Image
                  src={item.seller_item.image || ''}
                  height={50}
                  width={50}
                  alt="image"
                  className={'h-[100px] w-auto'}
                />
              </div>
            </div>

            <label className="text-[18px] text-[#333333]">
              {t('SCREEN.BUY_FROM_SELLER.SELLER_ITEMS_FEATURE.BUYING_QUANTITY_LABEL')}:
            </label>
            <div className="flex items-center gap-4 w-full mt-1">
              <div className="flex gap-2 items-center justify-between mr-7">
                <input
                  name="duration"
                  type="number"
                  value={item.quantity}
                  className="p-[10px] block rounded-xl border-[#BDBDBD] bg-transparent outline-0 text-center focus:border-[#1d724b] border-[2px] max-w-[80px]"
                  disabled={true}
                />
              </div>
              <Button
                label="Refund"
                styles={{
                  color: '#ffc153',
                  width: '100%',
                }}
                // onClick={() => handlePicked(formData._id)}
              />
              <Button
                label="Fulfill"
                styles={{
                  color: '#ffc153',
                  width: '100%',
                }}
                onClick={() => handleFufill(item._id)}
              />
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
        <div className="flex flex-col gap-y-4">
          <Button
            label={"Order completed"}
            // disabled={!isSaveEnabled}
            styles={{
              color: '#ffc153',
              height: '40px',
              padding: '15px 20px',
              width:'100%'
            }}
            // onClick={()=>checkoutOrder()}
          />

          <Button
            label={"Order Dispatched/Collected"}
            // disabled={!isSaveEnabled}
            styles={{
              color: '#ffc153',
              height: '40px',
              padding: '15px 20px',
              width:'100%'
            }}
            // onClick={()=>checkoutOrder()}
          />
        </div>
      </div>
    </div>
  );
};
