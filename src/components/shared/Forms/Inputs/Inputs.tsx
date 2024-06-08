import Image from 'next/image';
import { useTranslations } from 'next-intl';

import React from 'react';
import PhoneInput from 'react-phone-number-input'

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
        onChange={(e) => props.onChange(e)}
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
          {t('SHARED.PHOTO.IMAGE_DROP_UPLOAD_MESSAGE')}
        </div>
        <span className="text-[#828282] dark:text-white text-[11px] mt-1">
        {t('SHARED.PHOTO.SUPPORTS_FILE_MESSAGE')}
        </span>
        <span className="text-[#DF2C2C] text-[11px] mt-1">{t('SHARED.PHOTO.SINGLE_PHOTO_MESSAGE')}</span>
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          multiple
          className={`absolute scale-[5] opacity-0 cursor-pointer`}
          onChange={(e) => props.handleAddImages(e)}
        />
      </div>
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
