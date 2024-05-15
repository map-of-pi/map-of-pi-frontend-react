import React from 'react';
import styles from './sidebar.module.css';
import { MdOutlineLanguage } from 'react-icons/md';
import { FaChevronDown } from 'react-icons/fa6';
import { Languages } from '@/constants/languages';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (code: string) => {
    const slipPathname = pathname.split('/').slice(2);
    slipPathname.unshift(code);
    const retPathname = slipPathname.join('/');
    retPathname.toString();
    router.replace(`/${retPathname}`);
  };

  return (
    <>
      <div className="">
        <div
          className={`${styles.sidebar} bg-[#F5F5F5] dark:bg-[#212121] right-0 top-[55.99px] z-50`}>
          <div className=" p-[15px]">
            <div className="flex justify-between py-3 items-center">
              <div className="flex gap-2 items-center">
                <MdOutlineLanguage
                  size={24}
                  className="text-[#000000] dark:text-[#FFFFFF]"
                />
                <span>Language</span>
              </div>
              <FaChevronDown
                size={16}
                className="text-[#000000] dark:text-[#FFFFFF]"
              />
            </div>
            {Languages.map((lang) => (
              <div
                key={lang.code}
                className={`${styles.lang_section} mb-2 bg-[#f0f0f0] dark:rgba(0, 0, 0, 0.822) text-[#000000] dark:text-[#ffffff]`}
                onClick={() => handleLanguageChange(lang.code)}>
                <div className={styles.lan_img_con}>
                  <div className="min-w-5 min-h-5 relative">
                    <Image src={lang.imageUrl} alt={lang.name} fill />
                  </div>
                </div>
                <div className="ml-[1rem] flex flex-col">
                  <span className="font-bold text-[12px]">{lang.label}</span>
                  <span className="block text-[10px]">{lang.translation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
