'use client';

import React, { useState } from 'react';
import { Button } from '@/components/shared/Forms/Buttons/Buttons';
import {
  FileInput,
  Input,
  Select,
  TextArea,
} from '@/components/shared/Forms/Inputs/Inputs';
import Switch from 'react-switch';

const switchProp = {
  onColor: '#090c495e',
  offHandleColor: '#ffffff',
  offColor: '#F0F0F0',
  onHandleColor: '#ffffff',
  handleDiameter: 26,
  height: 35,
  width: 60,
  checkedIcon: false,
  uncheckedIcon: false,
};

function Settings() {
  const [center, setCenter] = useState({
    search: true,
    buy: false,
    sell: false,
  });
  const handleAddImages = () => {};
  const handleCenter = (value: string) => {
    value === 'search' && setCenter({ ...center, search: !center.search });
    value === 'buy' && setCenter({ ...center, buy: !center.buy });
    value === 'sell' && setCenter({ ...center, sell: !center.sell });
  };

  return (
    <>
      <form className="px-[25px] py-[36px] text-[#333333] sm:max-w-[520px] w-full m-auto">
        <div className="flex justify-between items-center mb-7">
          <h1 className="text-[#333333] font-bold text-3xl">Seller Settings</h1>
        </div>
        <div className="">
          <h2 className="text-2xl mb-5">Profile Settings</h2>
          <Input label="Enter Name" placeholder="peejenn" />
          <Input
            label="Enter Email Address"
            placeholder="peejenn@example.com"
            type="email"
          />
          <Input
            label="Enter Phone Number"
            placeholder="M & M Restaurant"
            type="number"
          />
          <FileInput
            label="Upload Photo (Optional)"
            images={[]}
            handleAddImages={handleAddImages}
          />
        </div>
        <div className="mt-10">
          <h1 className="text-[#333333] text-2xl mb-5">Map Center Settings</h1>
          <Select
            label="Search Center"
            options={[
              { value: 'Ilinois cener, 4 bk', name: 'Ilinois cener, 4 bk' },
            ]}
          />
          <Select
            label="Search Center"
            options={[
              { value: 'Ilinois cener, 4 bk', name: 'Ilinois cener, 4 bk' },
            ]}
          />
          <Select
            label="Buy Center"
            options={[
              { value: 'Ilinois cener, 4 bk', name: 'Ilinois cener, 4 bk' },
            ]}
          />
          <Select
            label="Seller Center"
            options={[
              { value: 'Ilinois cener, 4 bk', name: 'Ilinois cener, 4 bk' },
            ]}
          />
        </div>
        <div className="mt-10">
          <h1 className="text-[#333333] text-2xl mb-2">Search Settings</h1>
          <h2 className="mb-5">Select map center to be shown on your map</h2>
          <div className="flex justify-between mb-4">
            <h1 className="block text-xl text-[#333333]">Search Center</h1>
            <Switch
              onChange={() => handleCenter('search')}
              {...switchProp}
              checked={center.search}
            />
          </div>
          <div className="flex justify-between mb-4">
            <h1 className="block text-xl text-[#333333]">Buy Center</h1>
            <Switch
              onChange={() => handleCenter('buy')}
              {...switchProp}
              checked={center.buy}
            />
          </div>
          <div className="flex justify-between mb-4">
            <h1 className="block text-xl text-[#333333]">Sell Center</h1>
            <Switch
              onChange={() => handleCenter('sell')}
              {...switchProp}
              checked={center.sell}
            />
          </div>
        </div>
        <div className="mt-10 ml-auto">
          <Button label="Save" disabled={true} />
        </div>
      </form>
    </>
  );
}

export default Settings;
