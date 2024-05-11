'use client';

import { Button } from '@/components/shared/Forms/Buttons/Buttons';
import {
  FileInput,
  Input,
  Select,
  TextArea,
} from '@/components/shared/Forms/Inputs/Inputs';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

function AddProduct() {
  const t = useTranslations();

  const SelectOptions = [
    {
      name: `${t('BUSINESS.ADD_PRODUCT.LABELS.SHIPPING_TYPE')}`,
      value: 'free',
    },
    {
      name: `${t('BUSINESS.ADD_PRODUCT.OPTIONS.SHIPPING_TYPES.PAID_SHIPPING')}`,
      value: 'paid',
    },
    {
      name: `${t('BUSINESS.ADD_PRODUCT.OPTIONS.SHIPPING_TYPES.PICKUP')}`,
      value: 'pickup',
    },
    {
      name: `${t('BUSINESS.ADD_PRODUCT.OPTIONS.SHIPPING_TYPES.PAY_ON_DELIVERY')}`,
      value: 'cod',
    },
  ];

  const [files, setFiles] = useState<any>([]);
  const [previewImage, setPreviewImage] = useState<any>([]);

  const handleAddImages = (e: any) => {
    e.target.files && e.target.files.length > 0 && setFiles(e.target.files);
  };

  useEffect(() => {
    if (!files) return;

    const tmp = [];
    for (let i = 0; i < files.length; i++) {
      tmp.push(URL.createObjectURL(files[i]));
    }
    const objectUrl = tmp;
    setPreviewImage(objectUrl);
    // free memory
    for (let i = 0; i < objectUrl.length; i++) {
      return () => {
        URL.revokeObjectURL(objectUrl[i]);
      };
    }
  }, [files]);

  return (
    <div className="max-w-[400px] mt-[50px] m-auto p-4">
      <form action="">
        <Input
          label={t('BUSINESS.ADD_PRODUCT.LABELS.PRODUCT_NAME')}
          name="product_name"
        />
        <TextArea
          label={t('BUSINESS.ADD_PRODUCT.LABELS.PRODUCT_DESCRIPTION')}
          name="product_desc"
        />
        <FileInput
          label={t('BUSINESS.ADD_PRODUCT.LABELS.PRODUCT_IMAGES')}
          handleAddImages={handleAddImages}
          images={previewImage}
        />
        <Input
          label={t('BUSINESS.ADD_PRODUCT.LABELS.PRODUCT_PRICE')}
          name=""
          type="number"
          icon={true}
        />
        <Input
          label={t('BUSINESS.ADD_PRODUCT.LABELS.PRODUCT_QUANTITY')}
          name=""
          type="number"
        />
        <Select
          label={t('BUSINESS.ADD_PRODUCT.LABELS.SHIPPING_TYPE')}
          options={SelectOptions}
        />
        <Button label={t('BUSINESS.ADD_PRODUCT.BUTTONS.SUBMIT')} />
      </form>
    </div>
  );
}

export default AddProduct;
