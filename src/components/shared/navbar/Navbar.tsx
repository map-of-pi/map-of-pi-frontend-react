'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useContext, useEffect, useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import { IoMdArrowBack, IoMdClose } from 'react-icons/io';
import { MdHome } from 'react-icons/md';

import Sidebar from '../sidebar/sidebar';
import styles from './Navbar.module.css';
import { AppContext } from '../../../../context/AppContextProvider';

function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const local = useLocale();
  const t = useTranslations();
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [checkHomePage, setCheckHomePage] = useState(true);

  const {isSigningInUser} = useContext(AppContext)

  // check if the current page is the homepage
  useEffect(() => {
    const CheckHomePage = () => {
      if (pathname === `/${local}`) {
        setCheckHomePage(true);
      } else {
        setCheckHomePage(false);
      }
    };

    CheckHomePage();
  });

  const handleBackBtn = () => {
    router.back();
  };

  const handleMenu = () => {
    setSidebarToggle(!sidebarToggle);
  };

  return (
    <>
      <div
        className={`w-full h-[76.19px] z-500 px-[16px] py-[5px] bg-primary fixed top-0 left-0 right-0 `}>
        <div className="text-center text-secondary text-[1.3rem] whitespace-nowrap">
          { isSigningInUser ? t('SHARED.LOADING_SCREEN_MESSAGE'): "Map of Pi"}
        </div>
        <div
          className="flex justify-between">
          <div className={`${styles.nav_item} ${checkHomePage && 'disabled'}`}>
            <Link href="/" onClick={handleBackBtn}>
              <IoMdArrowBack size={26} className={`${checkHomePage ? 'text-tertiary' : 'text-secondary'}`} />
            </Link>
          </div>

            <div className={`${styles.nav_item} ${checkHomePage && 'disabled'}`}>
              <Link href="/">
                <MdHome size={24} className={`${checkHomePage ? 'text-tertiary' : 'text-secondary'}`} />
              </Link>
            </div>
          <div className={`${styles.nav_item}`}>
          <Link
            href=""
            onClick={(e) => {
              if (isSigningInUser) {
                e.preventDefault();
              } else {
                handleMenu();
              }
            }}
          >
            {sidebarToggle && !isSigningInUser ? (
              <IoMdClose size={24} className="text-secondary" />
            ) : (
              <FiMenu
                size={24}
                className={`${
                  isSigningInUser ? 'text-tertiary cursor-not-allowed' : 'text-secondary'
                }`}
              />
            )}
          </Link>
          </div>
        </div>
      </div>
      {sidebarToggle && !isSigningInUser && (
        <Sidebar toggle={sidebarToggle} setToggleDis={setSidebarToggle} />
      )}
    </>
  );
}

export default Navbar;
