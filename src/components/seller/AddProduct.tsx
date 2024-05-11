import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { FileInput2, Input, TextArea } from '../shared/Forms/Inputs/Inputs';
import { Button } from '../shared/Forms/Buttons/Buttons';

function AddProduct(props: any) {
  const t = useTranslations();

  const [file, setfile] = useState<any>('');
  const [previewImage, setPreviewImage] = useState<any>('');

  const handleAddImage = (e: any) => {
    setfile(e.target.files[0]);
  };

  useEffect(() => {
    if (!file) return;

    // const tmp = [];
    // for (let i = 0; i < file.length; i++) {
    //   tmp.push(URL.createObjectURL(file[i]));
    // }
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
    // free memory
    for (let i = 0; i < objectUrl.length; i++) {
      return () => {
        URL.revokeObjectURL(objectUrl[i]);
      };
    }
  }, [file]);

  const handleDeleteImage = () => {
    setPreviewImage('')
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-56px)] overflow-y-scroll bg-[#00000080] absolute mb-3 top-0">
      <div
        className="absolute w-full h-full left-0 top-0"
        onClick={() => props.setToggle(false)}></div>
      <div className="bg-white max-w-[500px] w-[90%] relative rounded-xl p-10">
        <form>
          <button
            className="absolute top-2 right-4 border-none text-[22px]"
            onClick={() => props.setToggle(false)}>
            ×
          </button>
          <h2 className="text-center text-[20px] mt-2 mb-5">
            {t(
              'BUSINESS.CONFIGURATION.ADD_PRODUCT_MENU.LABELS.ADD_PRODUCT_INTO_SHOP_MESSAGE',
            )}
          </h2>
          <Input
            label={t(
              'BUSINESS.CONFIGURATION.ADD_PRODUCT_MENU.LABELS.PRODUCT_NAME',
            )}
            name=""
          />
          <FileInput2
            label={t(
              'BUSINESS.CONFIGURATION.ADD_PRODUCT_MENU.LABELS.PRODUCT_IMAGES',
            )}
            handleAddImage={handleAddImage}
            image={previewImage}
            handleDeleteImage={handleDeleteImage}
          />
          <Input
            label={t('BUSINESS.CONFIGURATION.ADD_PRODUCT_MENU.LABELS.PRICE')}
            type="number"
            icon={true}
          />
          <TextArea
            label={t(
              'BUSINESS.CONFIGURATION.ADD_PRODUCT_MENU.LABELS.DESCRIPTION',
            )}
          />
          <Button
            label={t('BUSINESS.CONFIGURATION.ADD_PRODUCT_MENU.BUTTONS.CONFIRM')}
            styles={{ backgroundColor: '#1d724b', width: '100%' }}
          />
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
