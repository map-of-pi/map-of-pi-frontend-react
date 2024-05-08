import { Button } from '@/components/shared/Forms/Buttons/Buttons'
import{ FileInput, Input, Select, TextArea } from '@/components/shared/Forms/Inputs/Inputs'
import { useTranslations } from 'next-intl'
import React from 'react'


function page() {
    const t = useTranslations()

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
        
    ]
  return (
    <div className='max-w-[400px] m-auto p-4'>
    <form action="">
        <Input label={t('BUSINESS.ADD_PRODUCT.LABELS.PRODUCT_NAME')} name='product_name'  />
        <TextArea label={t('BUSINESS.ADD_PRODUCT.LABELS.PRODUCT_DESCRIPTION')} name='product_desc'  />
        <FileInput label={t('BUSINESS.ADD_PRODUCT.LABELS.PRODUCT_IMAGES')} />
        <Input label={t('BUSINESS.ADD_PRODUCT.LABELS.PRODUCT_PRICE')} name='product_name' type='number' />
        <Input label={t('BUSINESS.ADD_PRODUCT.LABELS.PRODUCT_QUANTITY')} name='product_name' type='number' />
        <Select label={t('BUSINESS.ADD_PRODUCT.LABELS.SHIPPING_TYPE')} options={SelectOptions} />
        <Button label={t('BUSINESS.ADD_PRODUCT.BUTTONS.SUBMIT')} />
    </form>
    </div>
  )
}

export default page