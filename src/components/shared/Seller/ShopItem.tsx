'use client';

import { useState, SetStateAction, useContext, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "../Forms/Buttons/Buttons";
import { TextArea, Input, FileInput, Select } from "../Forms/Inputs/Inputs";
import { Notification } from "../confirm";
import { ISeller, SellerItem, StockLevelType } from "@/constants/types";
import { addOrUpdateSellerItem, deleteSellerItem, fetchSellerItems } from "@/services/sellerApi";
import removeUrls from "@/utils/sanitize";
import { AppContext } from "../../../../context/AppContextProvider";
import logger from '../../../../logger.config.mjs';

export default function OnlineShopping({ dbSeller }: { dbSeller: ISeller }) {
  const t = useTranslations();
  const SUBHEADER = 'font-bold mb-2';

  const { reload, setReload } = useContext(AppContext);
  const [isAddItemEnabled, setIsAddItemEnabled] = useState(false);
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);
  const [isNewItem, setIsNewItem] = useState<boolean>(false);
  const [dbSellerItems, setDbSellerItems] = useState<SellerItem[] | null>(null)

  const observer = useRef<IntersectionObserver | null>(null);
  
  useEffect(() => {
    // Intersection Observer
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const itemId = entry.target.getAttribute("data-id");
            if (itemId) {
              setFocusedItemId(itemId);
            }
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the item is in view
      }
    );
    return () => {
      observer.current?.disconnect(); // Clean up observer
    };
  }, []);
      
  const handleShopItemRef = (node: HTMLElement | null) => {
    if (node && observer.current) {
      observer.current.observe(node);
    }
  };

  // Fetch seller items
  useEffect(() => {
    const getSellerItems = async (seller_id: string) => {
      try {
        const items = await fetchSellerItems(seller_id);
        if (items) {
          setDbSellerItems(items);
        } else {
          setDbSellerItems(null);
        }
      } catch (error) {
        logger.error('Error fetching seller items data:', error);
      } finally {
        setReload(false);
        setIsNewItem(false);
      }
    };
    
    if (dbSeller){
      getSellerItems(dbSeller.seller_id);
    }
  }, [dbSeller, reload]); 

  const emptyForm: SellerItem = {
    seller_id: dbSeller.seller_id as string,
    name: "",
    _id: "",
    duration: 1,
    price: {$numberDecimal: 0.01},
    description: "",
    image: "",
    stock_level: StockLevelType.available_1,
  }

  const translatedFulfillmentMethod = [
    {
      value: 'pickup',
      name: t(
        'SCREEN.SELLER_REGISTRATION.FULFILLMENT_METHOD_TYPE.FULFILLMENT_METHOD_TYPE_OPTIONS.COLLECTION_BY_BUYER',
      ),
    },
    {
      value: 'delivery',
      name: t(
        'SCREEN.SELLER_REGISTRATION.FULFILLMENT_METHOD_TYPE.FULFILLMENT_METHOD_TYPE_OPTIONS.DELIVERED_TO_BUYER',
      ),
    },
  ];

  return (
    <>        
      <div className="mb-4">
        <h2 className='text-gray-500 text-lg'>
          {t('SCREEN.SELLER_REGISTRATION.MAPPI_ALLOWANCE_LABEL')}: 999
        </h2>
        <Button
          label={t('SHARED.ADD_ITEM')}
          disabled={isAddItemEnabled}
          onClick={()=>setIsNewItem(true)}
          styles={{
            color: '#ffc153',
            height: '40px',
            padding: '10px 15px',
            marginLeft: 'auto',
          }}
        />
      </div>
      <div className="max-h-[600px] overflow-y-auto p-1 mb-7">
        {(isNewItem) && 
          <ShopItem
            key={''}
            item={emptyForm}
            isActive={true}
            refCallback={handleShopItemRef} // Attach observer
            setIsAddItemEnabled={setIsAddItemEnabled}
          /> 
        }
        {dbSellerItems && dbSellerItems.length > 0 && 
          dbSellerItems.map((item) => (
            <ShopItem
              key={item._id}
              item={item}
              isActive={focusedItemId === item._id}
              refCallback={handleShopItemRef} // Attach observer
              setIsAddItemEnabled={setIsAddItemEnabled}
            /> 
          ))            
        }
      </div>
      <div>
        <Select
          label={t(
            'SCREEN.SELLER_REGISTRATION.FULFILLMENT_METHOD_TYPE.FULFILLMENT_METHOD_TYPE_LABEL',
          )}
          name="fulfillment_method"
          options={translatedFulfillmentMethod}
        />
        <h2 className={SUBHEADER}>
          {t('SCREEN.SELLER_REGISTRATION.FULFILLMENT_METHOD_TYPE.FULFILLMENT_METHOD_TYPE_LABEL')}
        </h2>
        {/* <Select
          name="fulfillment_method"
          options={translatedFulfillmentMethod}
        />
        <h2 className={SUBHEADER}>
          {t('SCREEN.SELLER_REGISTRATION.FULFILLMENT_INSTRUCTIONS_LABEL')}
        </h2> */}
        <TextArea
          label={t(
            'SCREEN.SELLER_REGISTRATION.FULFILLMENT_INSTRUCTIONS_LABEL',
          )}
          placeholder={t(
            'SCREEN.SELLER_REGISTRATION.FULFILLMENT_INSTRUCTIONS_PLACEHOLDER',
          )}
          name="delivery_address"
          type="text"
        />
        {/* <TextArea
          name="delivery_address"
          type="text"
          placeholder={t('SCREEN.SELLER_REGISTRATION.FULFILLMENT_INSTRUCTIONS_PLACEHOLDER')}
          styles={{ height: '80px' }}
        /> */}
      </div>
    </>
  );
};

export const ShopItem: React.FC<{
  item: SellerItem;
  isActive: boolean;
  refCallback: (node: HTMLElement | null) => void;
  setIsAddItemEnabled: React.Dispatch<SetStateAction<boolean>>;
}> = ({ item, isActive, refCallback, setIsAddItemEnabled }) => {
  const t = useTranslations();
  
  const translatedStockLevelOption = Object.values(StockLevelType).map((value) => ({
    value,
    name: t(value)
  }));
  
  const [formData, setFormData] = useState<SellerItem>({
    seller_id: item.seller_id || '',
    name: item.name || '',
    description: item.description || '',
    duration: item.duration || 1,
    price: item.price || 0.01,
    image: item.image || '',
    stock_level: item.stock_level || translatedStockLevelOption[0].name, 
    _id: item._id || ''
  });
  
  const [previewImage, setPreviewImage] = useState<string>(
    formData?.image || '',
  );
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const { reload, setReload, showAlert } = useContext(AppContext);

  // Handle image upload
  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]; // only take the first file
    if (selectedFile) {
      setFile(selectedFile);

      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewImage(objectUrl);
      logger.info('Image selected for upload:', { selectedFile });

      setIsAddItemEnabled(true);
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
      | { name: string; value: string },
  ) => {
    // handle such scenarios where the event might not have the typical e.target structure i.e., PhoneInput.
    const name = 'target' in e ? e.target.name : e.name;
    const value = 'target' in e ? e.target.value : e.value;
  
    // Create a new object with the updated form data
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedFormData);
  
    // enable or disable add item button based on form inputs
    const isFormFilled = Object.values(updatedFormData).some((v) => v !== '');
    setIsAddItemEnabled(isFormFilled);
  };
    
  const handleIncrement = () => {
    const updatedQuantity = parseInt(formData.duration.toString()) + 1;
    setFormData({ ...formData, duration: updatedQuantity });
    setIsAddItemEnabled(true); // Enable add item button
  };
    
  const handleDecrement = () => {
    if ((formData.duration || 0) > 1) {
      const updatedQuantity = parseInt(formData.duration.toString()) - 1;
      setFormData({ ...formData, duration: updatedQuantity });
      setIsAddItemEnabled(true); // Enable add item button
    }
  };

  const handleSave = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('name', removeUrls(formData.name));
    formDataToSend.append('_id', formData._id || '');
    formDataToSend.append('description', removeUrls(formData.description || ''));
    formDataToSend.append('duration', formData.duration?.toString() ?? 1);
    formDataToSend.append('seller_id', '');
    formDataToSend.append('stock_level', formData.stock_level || '1 available');
    formDataToSend.append('price', formData.price.$numberDecimal?.toString() ?? 0.01);
  
    if (file) {
      formDataToSend.append('image', file);
    }

    try {
      logger.info('Form data being sent:', Object.fromEntries(formDataToSend.entries()));
      const data = await addOrUpdateSellerItem(formDataToSend);
      if (data) {
        logger.info('Saved seller item', data);
        setReload(true);
        setShowDialog(true); 
        setIsAddItemEnabled(false);
        logger.info('Seller item saved successfully:', { data });
        showAlert(t('Item modify successfully'));
      }
    } catch (error) {
      logger.error('Error saving seller item:', error);
      showAlert(t('Error adding or modifying items'));
    }
  };

  const handleDelete = async (item_id: string)=> {
    if (!item_id || item_id==='') {
      return showAlert('Item not found');     
    }
      
    try {
      const resp = await deleteSellerItem(item_id);
      if (resp) {
        setReload(true);
        setShowDialog(true); 
        setIsAddItemEnabled(false);
        showAlert(t('Item deleted successfully'));
      }
    } catch (error) {
      logger.error('Error deleting seller item:', error);
      showAlert('Error deleting seller item');                
    }
  }
  
  return (
    <>
      <div
        ref={refCallback}
        data-id={item._id} // Add a unique identifier for each item
        className={`relative outline outline-50 outline-gray-600 rounded-lg mb-7 cursor-pointer 
          ${isActive ? '' : 'opacity-50 pointer-events-none'}`}
      >
        <Notification message={'Save successful, Mappi allowance used 99'} showDialog={showDialog} setShowDialog={setShowDialog} />
        <div className="p-3">
          <div className="flex gap-x-4">
            <div className="flex-auto w-64">
              <Input
                label={t('Item:')}
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                disabled={!isActive} // Disable if not active
              />
            </div>
        
            <div className="flex-auto w-32">
              <div className="flex items-center gap-1">
                <Input
                  label={t('Price:')}
                  name="price"
                  type="number"
                  value={formData.price.$numberDecimal}
                  onChange={handleChange}
                  disabled={!isActive} // Disable if not active
                />
                <p className="text-gray-500 text-sm">Pi</p>
              </div>
            </div>
          </div>
          <div className="flex gap-x-4 items-center">
            <div className="flex-auto w-64">
              <TextArea
                label={'Description:'}
                placeholder={t('Item detail information')}
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={!isActive} // Disable if not active
                styles={{ height: '100px' }}
              />
            </div>
            <div className="flex-auto w-32 gap-2">
              <label className="block text-[17px] text-[#333333]">Photo:</label>
              <FileInput
                imageUrl={previewImage}
                handleAddImage={handleAddImage}
                height={'h-[100px]'}
                hideCaption={true}
              />
            </div>
          </div>
          <Select
            label='Stock level:'
            name="stock_level"
            value={formData.stock_level}
            onChange={handleChange}
            options={translatedStockLevelOption}
            disabled={!isActive}
          />
          <label className="text-[18px] text-[#333333]">
            {t('Selling duration in weeks')}:
          </label>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 items-center">
              <Button
                label="-"
                disabled={!isActive || formData.duration <= 1} // Disable if not active or quantity is zero
                styles={{
                  color: "#ffc153",
                  padding: "10px 15px",
                  borderRadius: "100%",
                }}
                onClick={handleDecrement} // Decrement handler
              />
              <Input
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                disabled={!isActive} // Disable if not active
              />
              <Button
                label="+"
                disabled={!isActive} // Disable if not active
                styles={{
                  color: "#ffc153",
                  padding: "10px 15px",
                  borderRadius: "100%",
                  marginRight: "5px",
                }}
                onClick={handleIncrement} // Increment handler
              />
            </div>
            <Button
              label={t('Delete')}
              disabled={!isActive} // Disable if not active
              styles={{
                color: '#ffc153',
                height: '40px',
                padding: '10px 15px',
              }}
              onClick={()=>handleDelete(formData._id)}
            />
            <Button
              label={t('SHARED.SAVE')}
              disabled={!isActive} // Disable if not active
              styles={{
                color: '#ffc153',
                height: '40px',
                padding: '10px 15px',
              }}
              onClick={handleSave}
            />
          </div>
          <label className="text-[14px] text-[#333333]">
            <span className="fw-bold text-lg">
              {t('Active')}: 
            </span>
            {t('Sell by 21 November 2024, 13:00pm')}
          </label>
        </div>
      </div>
    </>
  );
};
  