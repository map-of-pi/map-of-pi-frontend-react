'use client';

import { Button, YellowBtn } from '@/components/shared/Forms/Buttons/Buttons';
import SearchBar from '@/components/shared/SearchBar/SearchBar';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { FaCirclePlus } from "react-icons/fa6";

export default function Index({}: { params: { locale: string } }) {
  const DynamicMap = dynamic(() => import('../../components/shared/map/Map'), {
    ssr: false,
  });

  return (
    <>
      <DynamicMap />
      <SearchBar />
      <div className="absolute bottom-8 z-10 flex justify-between gap-[22px] px-7 right-0 left-0 m-auto">
          <Button
            label="+Sell"
            styles={{ borderRadius: '10px', color: '#ffc153'}}
          />
          <Button
            icon={<Image src='/images/shared/my_location.png' width={30} height={30} alt='my location' objectFit='cover' />}
            styles={{borderRadius: '50%', width: '40px', height: '40px', padding: '0px'}}
          />
        </div>
    </>
  );
}
