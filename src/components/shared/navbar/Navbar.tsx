'use client';

import React, { useEffect, useState } from 'react';
import styles from './Navbar.module.css';
import Link from 'next/link';

import {
  MdHome,
} from 'react-icons/md';
import { FiMenu } from 'react-icons/fi';
import { IoMdArrowBack } from 'react-icons/io';

import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import Sidebar from '../sidebar/sidebar';
// import { useTranslations } from 'next-intl';

function Navbar() {

  const router = useRouter()
const [sidebarToggle, setSidebarToggle] = useState(false)
  // const { resolvedTheme, setTheme } = useTheme();

  // const handleTheme = () => {
  //   resolvedTheme === 'dark' ? setTheme('light') : setTheme('dark');
  // };

  const handleBackBtn = () => {
    router.back();
  }

  const handleMenu = () => {
    setSidebarToggle(!sidebarToggle)
  }

  return (
    <>
      <div
        className={`${styles.navbar} bg-[#ffffff] dark:bg-[#212121] fixed top-0 left-0 right-0`}>
        <div className={`${styles.nav_item}`}>
          <Link href="/" style={{ height: '24px' }} onClick={handleBackBtn}>
            <IoMdArrowBack  size={26} className="text-[#000000] dark:text-[#FFFFFF]" />
          </Link>
        </div>
        <div className={`${styles.nav_item}`}>
          <Link href="/" style={{ height: '24px' }}>
            <MdHome size={24} className="text-[#000000] dark:text-[#FFFFFF]" />
          </Link>
        </div>
        <div className={`${styles.nav_item}`}>
          <Link href='' onClick={handleMenu} style={{ height: '24px' }}>
            <FiMenu size={24} className="text-[#000000] dark:text-[#FFFFFF]" />
          </Link>
        </div>

      </div>
        {
          sidebarToggle && (
            <Sidebar toggle={sidebarToggle} setToggleDis={setSidebarToggle} />
          )
        }
    </>
  );
}

export default Navbar;
