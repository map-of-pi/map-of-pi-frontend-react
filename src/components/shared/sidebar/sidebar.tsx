import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useParams, usePathname, useRouter } from 'next/navigation';

import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';

import { menu } from '@/constants/menu';
import styles from './sidebar.module.css';

function Sidebar(props: any) {
  const pathname = usePathname();
  const params = useParams();
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
      props.setToggleDis(false);
    }
    if (title === 'Themes') {
      code === 'dark' ? setTheme('dark') : setTheme('light');
      props.setToggleDis(false);
    }
  };

  const handleMenu = (title: any, url: string) => {
    if (title !== 'Themes' && title !== 'Languages') {
      router.push(url);
      props.setToggleDis(false);
    }

    if (title === 'Themes' || title === 'Languages') {
      setToggle({ ...toggle, [title]: !toggle[title] });
    }
  };

  return (
    <>
      <div className="w-full h-[calc(100vh-56px)] fixed bottom-0 bg-transparent right-0 z-500">
        <div
          className="absolute w-full h-full bg-[#82828284]"
          onClick={() => props.setToggleDis(false)}></div>
        <div
          className={`${styles.sidebar} dark:bg-[#212121] sm:w-[300px] w-[200px] overflow-y-auto`}>
            <div className="text-2xl font-bold mb-4">User Preferences</div>
          {/* <div
            className="ml-auto flex justify-end mb-8"
            onClick={() => props.setToggleDis(false)}>
            <Image
              src="/images/shared/sidebar/close.svg"
              alt="close button"
              width={22}
              height={22}
              className="dark:invert cursor-pointer"
            />
          </div> */}
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
                      <div key={child.id} className="ml-6">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
