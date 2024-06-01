'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Switch from 'react-switch';
import { AddButton } from '@/components/shared/Forms/Buttons/Buttons';
import { useRouter } from 'next/navigation';
import AddProduct from '@/components/seller/AddProduct';

const switchProp = {
  onColor: '#619681',
  offHandleColor: '#5e5e5e',
  offColor: '#b6b6b6',
  onHandleColor: '#0a4223',
  handleDiameter: 26,
  height: 20,
  width: 40,
};

function Products() {
  const t = useTranslations();
  const router = useRouter();
  const [checked, setChecked] = useState({
    prod_on: true,
    pay_enable: false,
    without_payment: false,
  });
  const [toggleAddProd, setToggleAddProd] = useState(false);

  const handleChange = (check: any) => {
    check === 'prod_on' &&
      setChecked({ ...checked, prod_on: !checked.prod_on });
    check === 'pay_enable' &&
      setChecked({ ...checked, pay_enable: !checked.pay_enable });
    check === 'without_payment' &&
      setChecked({ ...checked, without_payment: !checked.without_payment });
  };

  const handleAddBtn = () => {
    // router.push('/seller/registration/add-product');
    setToggleAddProd(true);
  };

  return (
    <div className="flex justify-center relative">
      <div className="container px-4 py-4 max-w-96">
        <div className="text-center mb-4">
          <h1 className="text-2xl">
            {t('BUSINESS.CONFIGURATION.LABELS.SHOP_NAME')}
          </h1>
        </div>

        <div className="">
          <div className="flex gap-2 p-4">
            <Switch
              onChange={() => handleChange('prod_on')}
              {...switchProp}
              checked={checked.prod_on}
            />
            <span className="">{t('BUSINESS.CONFIGURATION.LABELS.MENU')}</span>
            <span className="">{checked.prod_on ? 'On': 'Off'}</span>
          </div>

          {checked.prod_on && (
            <div className="flex gap-2 p-4">
              <Switch
                onChange={() => handleChange('without_payment')}
                {...switchProp}
                checked={checked.without_payment}
              />
              <span className="">
                {t(
                  'BUSINESS.CONFIGURATION.LABELS.ACCEPT_ORDERS_WITHOUT_PAYMENT_MESSAGE',
                )}
              </span>
              <span className="">{checked.without_payment ? 'On': 'Off'}</span>
            </div>
          )}
          {checked.prod_on && (
            <div className="flex gap-2 p-4">
              <Switch
                onChange={() => handleChange('pay_enable')}
                {...switchProp}
                checked={checked.pay_enable}
              />
              <span className="">
                {t(
                  'BUSINESS.CONFIGURATION.LABELS.ACCEPT_PI_TRANSACTIONS_MESSAGE',
                )}
              </span>
              <span className="">{checked.pay_enable ? 'On': 'Off'}</span>
            </div>
          )}
        </div>
        {checked.prod_on && (
          <div className="w-full pt-8 text-center">
            <AddButton handleAddBtn={handleAddBtn} />
          </div>
        )}
      </div>
      {toggleAddProd && <AddProduct setToggle={setToggleAddProd} />}
    </div>
  );
}

export default Products;
