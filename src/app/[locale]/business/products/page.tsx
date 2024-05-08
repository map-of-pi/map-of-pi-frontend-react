'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Switch from 'react-switch';
import { AddButton } from '@/components/shared/Forms/Buttons/Buttons';
import { useRouter } from 'next/navigation';


const switchProp = {
  onColor: '#619681',
  offHandleColor: '#5e5e5e',
  offColor: '#b6b6b6',
  onHandleColor: '#0a4223',
  handleDiameter: 20,
  height: 16,
  width: 36,
};

function Products() {

  const t = useTranslations();
  const router = useRouter()
  const [checked, setChecked] = useState({
    prod_on: false,
    pay_enable: false,
    without_payment: false,
  });


  const handleChange = (check: any) => {
    check === 'prod_on' &&
      setChecked({ ...checked, prod_on: !checked.prod_on });
    check === 'pay_enable' &&
      setChecked({ ...checked, pay_enable: !checked.pay_enable });
    check === 'without_payment' &&
      setChecked({ ...checked, without_payment: !checked.without_payment });
  };

  const handleAddBtn = () => {
    router.push('/add-product')
  }


  return (
    <div className="flex justify-center">
      <div className="container px-4 py-8 max-w-96">
        <div className="text-center mb-4">
          <h1 className="text-2xl">{t('BUSINESS.PRODUCTS.TITLE')}</h1>
        </div>

        <div className="pt-8">
          <div className="flex gap-1 p-4">
            <Switch
              onChange={() => handleChange('prod_on')}
              {...switchProp}
              checked={checked.prod_on}
            />
            <span className="text-[14px]">
              {t('BUSINESS.PRODUCTS.PRODUCTS_ON')}
            </span>
          </div>

          <div className="flex gap-1 p-4">
            <Switch
              onChange={() => handleChange('pay_enable')}
              {...switchProp}
              checked={checked.pay_enable}
            />
            <span className="text-[14px]">
              {t('BUSINESS.PRODUCTS.IS_PI_PAYMENT_ENABLED')}
            </span>
          </div>

          <div className="flex gap-1 p-4">
            <Switch
              onChange={() => handleChange('without_payment')}
              {...switchProp}
              checked={checked.without_payment}
            />
            <span className="text-[14px]">
              {t('BUSINESS.PRODUCTS.CAN_ORDER_WITHOUT_PAYMENT')}
            </span>
          </div>
        </div>

        <div className="w-full pt-8 text-center">
          <AddButton handleAddBtn={handleAddBtn} />
        </div>
      </div>
    </div>
  );
}

export default Products;
