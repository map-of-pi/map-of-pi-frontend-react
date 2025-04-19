import { OrderStatusType, PartialOrderType } from "@/constants/types";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Input } from "../Forms/Inputs/Inputs";
import logger from '../../../../logger.config.mjs';
import { fetchSellerOrder } from "@/services/orderApi";
import Link from "next/link";
import { Button } from "../Forms/Buttons/Buttons";

export const ListOrder: React.FC<{
  user_id: string;
  user_name?: string;
  seller_type?: string;
}> = ({ user_id, user_name="", seller_type="" }) => {
  const locale = useLocale();
  const [orderList, setOrderList] = useState<PartialOrderType[] >([]);

   useEffect(() => {
    const getOrderList= async (id: string) => {
      try {
        const data = await fetchSellerOrder(id);
        if (data) {
          setOrderList(data);
        } else {
          setOrderList([]);
        }
      } catch (error) {
        logger.error('Error fetching seller items data:', error);
      }
    };
    
    getOrderList(user_id);
  }, [user_id]); 

  const t = useTranslations();

  return (
    <div>
        {orderList && orderList.length>0 && orderList.map((item, index)=>(
          <div
            data-id={item._id}
            key={index}
            className={`relative outline outline-50 outline-gray-600 rounded-lg mb-7 ${item.status===OrderStatusType.Completed ? 'bg-yellow-100' : item.status===OrderStatusType.Cancelled? 
            'bg-red-100' : ''}`}
          >
            <div className="p-3">
              <div className="flex gap-x-4">
                <div className="flex-auto w-64">
                  <Input
                    label={'Pioneer:'}
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
              <label className="block text-[17px] text-[#333333]">Time of order:</label>
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
                <Link href={seller_type ? 
                `/${locale}/seller/order-fulfillment/${item._id}?seller_name=${user_name}&seller_type=${seller_type}` 
                  :
                  `/${locale}/user/order-item/${item._id}?seller_name=${user_name}`}
                >       
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
    </div>
  );
};