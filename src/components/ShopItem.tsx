import { useTranslations } from "next-intl";
import Image from "next/image";
import { TextArea, Input } from "./shared/Forms/Inputs/Inputs";
import { Button } from "./shared/Forms/Buttons/Buttons";

type SellerItem = {
    name: string,
    item_id: string,
    price: number,
    quantity: number,
    description: string
    photo: string,
    last_sold: string,
    status: string,
}

export const ShopItem: React.FC<{
    item: SellerItem;
    isActive: boolean;
    refCallback: (node: HTMLElement | null) => void;
  }> = ({ item, isActive, refCallback }) => {
    const t = useTranslations();
  
    return (
        <>
        <div
            ref={refCallback}
            data-id={item.item_id} // Add a unique identifier for each item
            className={`outline outline-50 outline-gray-600 rounded-lg p-3 mb-7 cursor-pointer ${
            isActive ? '' : 'opacity-50 pointer-events-none'
            }`}
        >
        <div className="flex gap-x-4">
                <div className="flex-auto w-64">
                <Input
                    label={t('Item:')}
                    name="itemName"
                    type="text"
                    value={item.name}
                    disabled={!isActive} // Disable if not active
                />
                </div>
    
                <div className="flex-auto w-32">
                <div className="flex items-center gap-1">
                    <Input
                    label={t('Price:')}
                    name="itemPrice"
                    type="number"
                    value={item.price}
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
                        name="sellerDescription"
                        value={item.description}
                        disabled={!isActive} // Disable if not active
                        styles={{ height: '100px' }}
                    />
                </div>
                <div className="flex-auto w-32 gap-2">
                    <label className="block text-[17px] text-[#333333]">Photo:</label>
                    <Image
                        src={item.photo}
                        alt="product image"
                        width={100}
                        height={130}
                        className="object-cover rounded-md"
                    />
                </div>
        </div>
        <div className="flex items-center gap-2">
                <div className="flex gap-1 items-center">
                    <Button
                        label="-"
                        disabled={!isActive} // Disable if not active
                        styles={{
                        color: '#ffc153',
                        padding: '10px 15px',
                        borderRadius: '100%',
                        }}
                    />
                    <Input
                        name="itemQty"
                        type="number"
                        value={item.quantity}
                        disabled={!isActive} // Disable if not active
                    />
                    <Button
                        label="+"
                        disabled={!isActive} // Disable if not active
                        styles={{
                        color: '#ffc153',
                        padding: '10px 15px',
                        borderRadius: '100%',
                        marginRight: '5px',
                        }}
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
                />
            </div>
            <label className="block text-[14px] text-[#333333]">
                    <span className="fw-bold text-lg">{t(item.status)}: </span>
                    {t('Sell by 21 November 2024, 13:00pm')}
            </label>
        </div>
        </>
    );
  };
  