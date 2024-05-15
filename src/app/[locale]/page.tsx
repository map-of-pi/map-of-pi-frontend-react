'use client';

import { Button, YellowBtn } from '@/components/shared/Forms/Buttons/Buttons';
import SearchBar from '@/components/shared/SearchBar/SearchBar';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { IoMdAdd } from 'react-icons/io';

export default function Index({}: { params: { locale: string } }) {
  const DynamicMap = dynamic(() => import('../../components/shared/map/Map'), {
    ssr: false,
  });

  return (
    <>
      <DynamicMap />
      <SearchBar />
      <div className="absolute bottom-[78px] z-500 flex justify-center gap-[22px] px-6 right-0 left-0 m-auto">
          <Button
            label="Sell"
            styles={{padding: '5px 12px', borderRadius: '10px', width: '147px', height: '48px'}}
          />
          <Button
            icon={<Image src='/images/shared/my_location.png' width={35} height={35} alt='my location' objectFit='cover' />}
            styles={{borderRadius: '50%', width: '48px', height: '48px', padding: '0px'}}
          />
        </div>
    </>
  );
}
