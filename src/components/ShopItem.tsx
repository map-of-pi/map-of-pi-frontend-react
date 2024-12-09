import { useState, SetStateAction } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { TextArea, Input } from "./shared/Forms/Inputs/Inputs";
import { Button } from "./shared/Forms/Buttons/Buttons";
import { Notification } from "./shared/confirm";
import { FileInput } from "./shared/Forms/Inputs/Inputs";
import { SellerItem } from "@/constants/types";

export const ShopItem: React.FC<{
    item: SellerItem;
    isActive: boolean;
    refCallback: (node: HTMLElement | null) => void;
    setIsAddItemEnabled: React.Dispatch<SetStateAction<boolean>>;
  }> = ({ item, isActive, refCallback, setIsAddItemEnabled }) => {

    const [formData, setFormData] = useState<SellerItem>({
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        status: item.status,
        photo: item.photo,
        last_sold: item.last_sold, 
        item_id: item.item_id,
        stock_level: item.stock_level
      });
      const [previewImage, setPreviewImage] = useState<string>(
        formData?.photo || '',
      );
      const [showDialog, setShowDialog] = useState<boolean>(false);
      const [file, setFile] = useState<File | null>(null);

    const t = useTranslations();

    // Handle image upload
    const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]; // only take the first file
        if (selectedFile) {
        setFile(selectedFile);

        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewImage(objectUrl);
        //   logger.info('Image selected for upload:', { selectedFile });

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
    
        // enable or disable save button based on form inputs
        const isFormFilled = Object.values(updatedFormData).some((v) => v !== '');
        setIsAddItemEnabled(isFormFilled);
    };
    
    const handleIncrement = () => {
        const updatedQuantity = formData.quantity + 1;
        setFormData({ ...formData, quantity: updatedQuantity });
        setIsAddItemEnabled(true); // Enable save button
      };
    
      const handleDecrement = () => {
        if (formData.quantity > 0) {
          const updatedQuantity = formData.quantity - 1;
          setFormData({ ...formData, quantity: updatedQuantity });
          setIsAddItemEnabled(true); // Enable save button
        }
      };
  
    return (
        <>
        <div
            ref={refCallback}
            data-id={item.item_id} // Add a unique identifier for each item
            className={`relative outline outline-50 outline-gray-600 rounded-lg mb-7 cursor-pointer ${
            isActive ? '' : 'opacity-50 pointer-events-none'
            }`}
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
                            value={formData.price}
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
                        />
                    </div>
                </div>
                <Input
                    label={t('Stock level:')}
                    name="name"
                    type="text"
                    value={formData.stock_level}
                    onChange={handleChange}
                    disabled={!isActive} // Disable if not active
                />
                <label className="text-[18px] text-[#333333]">
                    {t('Selling duration in weeks')}:
                </label>
                <div className="flex items-center gap-2">
                    <div className="flex gap-1 items-center">
                    <Button
                        label="-"
                        disabled={!isActive || formData.quantity <= 0} // Disable if not active or quantity is zero
                        styles={{
                        color: "#ffc153",
                        padding: "10px 15px",
                        borderRadius: "100%",
                        }}
                        onClick={handleDecrement} // Decrement handler
                    />
                    <Input
                        name="quantity"
                        type="number"
                        value={formData.quantity}
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
                    />
                    <Button
                    label={t('SHARED.SAVE')}
                    disabled={!isActive} // Disable if not active
                    styles={{
                        color: '#ffc153',
                        height: '40px',
                        padding: '10px 15px',
                    }}
                    onClick={()=>{setShowDialog(true); setIsAddItemEnabled(false)}}
                    />
                </div>
                <label className="text-[14px] text-[#333333]">
                    <span className="fw-bold text-lg">{t(item.status.toUpperCase())}: </span>
                    {t('Sell by 21 November 2024, 13:00pm')}
                </label>
            </div>
        </div>
        </>
    );
  };
  