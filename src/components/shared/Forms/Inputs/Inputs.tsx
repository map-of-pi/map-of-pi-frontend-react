import React from 'react';
import PhoneInput from 'react-phone-number-input'

import styles from './Inputs.module.css';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

export const Input = (props: any) => {
  const { label, icon, ...input } = props;
  return (
    <>
      <div className="relative">
        {props.label && (
          <label className="block text-[17px] text-[#333333] dark:text-white">{props.label}</label>
        )}
        <input
          {...input}
          className={`mt-1 p-[10px] block w-full rounded-xl border-[#BDBDBD] bg-transparent outline-0 focus:border-[#1d724b] border-[2px] mb-4`}
        />
        {icon && (
          <div className="absolute right-1 bottom-[4px]">
            <Image src="/favicon-32x32.png" alt="icon" width={32} height={32} />
          </div>
        )}
      </div>
    </>
  );
};

export const TelephoneInput = (props: any) => {
  const { label, ...input } = props;
  return (
    <div className="">
      {props.label && (
        <label className="block text-[17px] text-[#333333] dark:text-white">{props.label}</label>
      )}
      <PhoneInput 
        {...input}
        className={`flex mt-1 p-[10px] block w-full rounded-xl border-[#BDBDBD] bg-transparent outline-0 focus:border-[#1d724b] border-[2px] mb-4`}
      />
    </div>
  );
};

export const TextArea = (props: any) => {
  return (
    <div className="">
      {props.label && (
        <label className=" block text-[17px] text-[#333333] dark:text-white">{props.label}</label>
      )}
      <textarea
        placeholder={props.placeholder}
        className="mt-1 p-2 block w-full rounded-xl  border-[#BDBDBD] bg-transparent outline-0 focus:border-[#1d724b] border-[2px] mb-4"></textarea>
    </div>
  );
};

export const FileInput = (props: any) => {
  const t = useTranslations();
  return (
    <div className="">
      {props.label && (
        <label className="block pb-3 font-medium text-gray-700 dark:text-white">{props.label}</label>
      )}
      <div className="flex flex-col items-center justify-center overflow-hidden p-3 pt-5 pb-5 rounded-md relative border-dashed border-[2px] border-green-700">
        <Image
          src="/images/shared/upload.png"
          alt="upload image"
          width={85}
          height={85}
        />
        <div className="mt-5 text-center text-[#828282] dark:text-white">
          Drop your image here, or{' '}
          <span className="text-[#593B8B]">browse</span>
        </div>
        <span className="text-[#828282] dark:text-white text-[11px] mt-1">
          Supports: PNG, JPG, JPEG, WEBP
        </span>
        <span className="text-[#DF2C2C] text-[11px] mt-1">One Photo Only</span>
        {/* <div className="select-none">
          {t('BUSINESS.ADD_PRODUCT.PLACEHOLDERS.PRODUCT_IMAGES')}
        </div> */}
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          multiple
          className={`absolute scale-[5] opacity-0 cursor-pointer`}
          onChange={(e) => props.handleAddImages(e)}
        />
      </div>
      {/* <label className="block font-medium text-gray-700 mt-2">
        {t('BUSINESS.ADD_PRODUCT.PLACEHOLDERS.PRODUCT_IMAGES_MAX')}
      </label> */}
      {/* {props.images.length > 0 ? (
        <div className="flex flex-wrap gap-2 mb-3">
          {' '}
          {props.images.map((image: any) => (
            <Image
              key={image}
              src={image}
              alt="Selected Image"
              width={50}
              height={50}
            />
          ))}
        </div>
      ) : (
        <div className="my-2 text-center text-gray-500 text-[14px]">
          {t('BUSINESS.ADD_PRODUCT.VALIDATIONS.PRODUCT_IMAGES')}
        </div>
      )} */}
    </div>
  );
};

export const FileInput2 = (props: any) => {
  const t = useTranslations();
  return (
    <div className="">
      {props.label && (
        <label className="block font-medium text-gray-700">{props.label}</label>
      )}

      {!props.image && (
        <div className="flex justify-center relative overflow-hidden w-[80%] left-0 right-0 m-auto gap-2 items-center mb-3">
          <Image
            src="/images/business/add-item-button.png"
            alt=""
            width={60}
            height={60}
            className="rounded-md"
          />
          <span>
            {t('BUSINESS.CONFIGURATION.ADD_PRODUCT_MENU.LABELS.ADD_IMAGE')}
          </span>
          <input
            type="file"
            name=""
            id=""
            className="absolute scale-[3] left-0 right-0 opacity-0"
            onChange={(e) => props.handleAddImage(e)}
          />
        </div>
      )}
      {props.image && (
        <div className="flex justify-between items-center">
          <Image
            src={props.image}
            alt="image"
            width={70}
            height={62}
            objectFit="cover"
          />
          <Image
            src={props.image}
            alt="image"
            width={60}
            height={60}
            objectFit="contain"
          />
          <div
            className="text-red-700 self-start text-3xl cursor-pointer"
            onClick={props.handleDeleteImage}>
            ×
          </div>
        </div>
      )}
    </div>
  );
};

export const Select = (props: any) => {
  return (
    <div className="">
      {props.label && (
        <label className="block text-xl text-[#333333] dark:text-white ">{props.label}</label>
      )}
      <select className="mt-1 p-[10px] block w-full rounded-xl border-[#BDBDBD] text-[#333333] dark:text-white outline-0 bg-transparent border-[2px] focus:border-[#1d724b] mb-3">
        {props.options.map((option: any) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};
