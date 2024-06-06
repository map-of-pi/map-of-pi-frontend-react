'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import { IoMdArrowBack, IoMdClose } from 'react-icons/io';
import { MdHome } from 'react-icons/md';

import Sidebar from '../sidebar/sidebar';
import styles from './Navbar.module.css';

function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const local = useLocale();
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [checkHomePage, setCheckHomePage] = useState(true);

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
        className={`${styles.navbar} bg-primary dark:bg-[#212121] fixed top-0 left-0 right-0 `}>
        <div className="text-center text-secondary text-[1.5rem] font-semibold">
        Map of Pi          
        </div>
        <div className={`flex ${checkHomePage ? 'justify-end' : 'justify-between'}`}>
          {!checkHomePage && (
            <div className={`${styles.nav_item}`}>
              <Link href="/" style={{ height: '24px' }} onClick={handleBackBtn}>
                <IoMdArrowBack
                  size={26}
                  className="text-secondary dark:text-[#FFFFFF]"
                />
              </Link>
            </div>
          )}
          {!checkHomePage && (
            <div className={`${styles.nav_item}`}>
              <Link href="/" style={{ height: '24px' }}>
                <MdHome
                  size={24}
                  className="text-secondary dark:text-[#FFFFFF]"
                />
              </Link>
            </div>
          )}

          <div className={`${styles.nav_item}`}>
            <Link href="" onClick={handleMenu} style={{ height: '24px' }}>
              {sidebarToggle ? (
                <IoMdClose
                  size={24}
                  className="text-secondary dark:text-[#FFFFFF]"
                />
              ) : (
                <FiMenu
                  size={24}
                  className="text-secondary dark:text-[#FFFFFF]"
                />
              )}
            </Link>
          </div>
        </div>
      </div>
      {sidebarToggle && (
        <Sidebar toggle={sidebarToggle} setToggleDis={setSidebarToggle} />
      )}
    </>
  );
}

export default Navbar;
