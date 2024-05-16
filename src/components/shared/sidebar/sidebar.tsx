import React, { useState } from 'react';
import styles from './sidebar.module.css';
import { MdOutlineLanguage } from 'react-icons/md';
import { FaChevronDown } from 'react-icons/fa6';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { menu } from '@/constants/menu';
import { useTheme } from 'next-themes';
function Sidebar(props: any) {
  const pathname = usePathname();
  const router = useRouter();

  const { resolvedTheme, setTheme } = useTheme();
  const [toggle, setToggle] = useState<any>({
    Themes: false,
    Languages: false,
  });

  const handChildMenu = (title: any, code: string) => {
    if (title === 'Languages') {
      const slipPathname = pathname.split('/').slice(2);
      slipPathname.unshift(code);
      const retPathname = slipPathname.join('/');
      retPathname.toString();
      router.replace(`/${retPathname}`);
    }
    if (title === 'Themes') {
      code === 'dark' ? setTheme('dark') : setTheme('light');
    }
  };

  const handleMenu = (title: any, url: string) => {
    if (title !== 'Themes' || title !== 'Languages') {
      router.push(url);
      // props.setToggleDis(false);
    }

    if (title === 'Themes' || title === 'Languages') {
      setToggle({ ...toggle, [title]: !toggle[title] });
    }
  };

  return (
    <>
      <div className="w-full h-full fixed top-0 bg-transparent left-0 z-500">
        <div
          className="absolute w-full h-full bg-[#82828284]"
          onClick={() => props.setToggleDis(false)}></div>
        <div
          className={`${styles.sidebar} dark:bg-[#212121] sm:w-[300px] w-[250px] overflow-y-auto`}>
          <div
            className="ml-auto flex justify-end mb-8"
            onClick={() => props.setToggleDis(false)}>
            <Image
              src="/images/shared/sidebar/close.svg"
              alt="close button"
              width={22}
              height={22}
              className="dark:invert cursor-pointer"
            />
          </div>
          <div className="">
            {menu.map((menu) => (
              <>
                <div key={menu.id} className="">
                  <div
                    className={`${styles.slide_content} hover:bg-[#424242] hover:text-white hover:dark:bg-[#ffffff] dark:text-white hover:dark:text-black`}
                    onClick={() => handleMenu(menu.title, menu.url)}>
                    <Image
                      src={menu.icon}
                      alt={menu.title}
                      width={22}
                      height={22}
                      className="dark:invert"
                    />
                    <span className="ml-2">{menu.title}</span>
                    {menu.children && (
                      <div className="ml-4">
                        <FaChevronDown
                          size={13}
                          className="text-[#000000] dark:text-[#FFFFFF] hover:invert"
                        />
                      </div>
                    )}
                  </div>
                  {/* MENU WITH CHILDREN */}
                  {menu.children &&
                    toggle[menu.title] &&
                    menu.children.map((child) => (
                      <div key={child.id} className="">
                        <div
                          className={`${styles.slide_content} hover:bg-[#424242] hover:text-white hover:dark:bg-[#ffffff] dark:text-white hover:dark:text-black`}
                          onClick={() => handChildMenu(menu.title, child.code)}>
                          <Image
                            src={child.icon}
                            alt={child.title}
                            width={17}
                            height={17}
                            className=""
                          />
                          <span className="ml-2 text-[14px]">
                            {child.title}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            ))}

            {/* <div className="flex justify-between py-3 items-center">
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
            ))} */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
