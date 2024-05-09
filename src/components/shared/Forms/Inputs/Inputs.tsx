import React from 'react';
import styles from './Inputs.module.css';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export const Input = (props: any) => {
  const { label, icon, ...input } = props;
  return (
    <>
      <div className="relative">
        {props.label && (
          <label className="block font-medium text-gray-700">
            {props.label}
          </label>
        )}
        <input
          {...input}
          className={`mt-1 p-2 block w-full rounded-md border-[#1d724b] border-[1px] mb-3`}
        />
      </div>
    </>
  );
};

export const TextArea = (props: any) => {
  return (
    <div className="">
      {props.label && (
        <label className="block font-medium text-gray-700">{props.label}</label>
      )}
      <textarea className="mt-1 p-2 block w-full rounded-md border-[#1d724b] border-[1px] mb-3"></textarea>
    </div>
  );
};

export const FileInput = (props: any) => {
  const t = useTranslations();
  return (
    <div className="">
      {props.label && (
        <label className="block font-medium text-gray-700">{props.label}</label>
      )}
      <div className="flex gap-5 items-center  overflow-hidden bg-blue-200 p-3 rounded-md relative">
        <Image
          src="/images/business/upload.jpg"
          alt="upload image"
          width={50}
          height={50}
        />
        <div className="select-none">
          {t('BUSINESS.ADD_PRODUCT.PLACEHOLDERS.PRODUCT_IMAGES')}
        </div>
        <input
          type="file"
          accept='image/png, image/jpeg, image/jpg'
          multiple
          className={`absolute scale-[5] opacity-0 cursor-pointer`}
          onChange={(e) => props.handleAddImages(e)}
        />
      </div>
      <label className="block font-medium text-gray-700 mt-2">
        {t('BUSINESS.ADD_PRODUCT.PLACEHOLDERS.PRODUCT_IMAGES_MAX')}
      </label>
      {
        props.images.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-3"> {
            props.images.map((image: any) => (
                <Image key={image} src={image} alt="Selected Image" width={50} height={50} />
            ))
          }
              </div>
        ) : (
          <div className="my-2 text-center text-gray-500 text-[14px]">
        {t('BUSINESS.ADD_PRODUCT.VALIDATIONS.PRODUCT_IMAGES')}
      </div>
        )
      }
      
    </div>
  );
};

export const Select = (props: any) => {
  return (
    <div className="">
      {props.label && (
        <label className="block font-medium text-gray-700">{props.label}</label>
      )}
      <select className="mt-1 p-2 block w-full rounded-md border-[#1d724b] border-[1px] mb-3">
        <option value=""></option>
            {
                props.options.map((option: any) => (
                    <option key={option.value} value={option.value}>{option.name}</option>
                ))
            }
      </select>
    </div>
  );
};
