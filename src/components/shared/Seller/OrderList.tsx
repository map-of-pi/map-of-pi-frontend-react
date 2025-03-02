import { PartialOrderType } from "@/constants/types";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Input } from "../Forms/Inputs/Inputs";
import logger from '../../../../logger.config.mjs';
import { fetchOrderList } from "@/services/orderApi";
import ToggleCollapse from "./ToggleCollapse";
import Link from "next/link";
import { Button } from "../Forms/Buttons/Buttons";

export const ListOrder: React.FC<{
  seller_id: string;
  seller_name?: string;
  seller_type?: string
}> = ({ seller_id, seller_name="", seller_type="" }) => {
  const locale = useLocale();
  const [orderList, setOrderList] = useState<PartialOrderType[] >([]);

   useEffect(() => {
    const getOrderList= async (id: string) => {
      try {
        const data = await fetchOrderList(id);
        if (data) {
          setOrderList(data);
        } else {
          setOrderList([]);
        }
      } catch (error) {
        logger.error('Error fetching seller items data:', error);
      }
    };
    
    getOrderList(seller_id);
  }, [seller_id]); 

  const t = useTranslations();

  return (
    <ToggleCollapse
      header={t('SCREEN.SELLER_REGISTRATION.SELLER_ONLINE_SHOPPING_ORDER_FULFILLMENT_LABEL')}
      open={false}>
        {orderList && orderList.length>0 && orderList.map((item, index)=>(
          <div
            data-id={item._id}
            key={index}
            className={`relative outline outline-50 outline-gray-600 rounded-lg mb-7`}
          >
            <div className="p-3">
              <div className="flex gap-x-4">
                <div className="flex-auto w-64">
                  <Input
                    label={'Pioneer:'}
                    name="name"
                    type="text"
                    value={item.pi_username}
                    disabled={true}
                  />
                </div>

                <div className="flex-auto w-32">
                  <div className="flex items-center gap-2">
                    <Input
                      label={'Total Price:'}
                      name="price"
                      type="number"
                      value={item.total_amount || item.total_amount.toString()}
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
                <Link href={`/${locale}/seller/order-fulfilment/${item._id}?seller_name=${seller_name}&seller_type=${seller_type}`}>       
                <Button
                  label={"Fulfill"}
                  disabled={false} 
                  styles={{
                    color: '#ffc153',
                    height: '40px',
                    padding: '10px 15px',
                    // width: "30%"
                  }}
                />
                </Link>
                
              </div>

            </div>
          </div>
        ))}      
    </ToggleCollapse>
  );
};