'use client';

import React, { useState } from 'react';
import styles from './Navbar.module.css';
import Link from 'next/link';
import Image from 'next/image';

import {
  MdHome,
  MdBrightness4,
  MdInfo,
  MdOutlineLanguage,
} from 'react-icons/md';

import LogoImage from '../../../public/images/logo.svg';
import InfoModel from '../Info/Info';
import LangModel from '../Lang-switcher/Lang-switcher';
import { useTheme } from 'next-themes';
// import { useTranslations } from 'next-intl';

function Navbar() {
  const [toggleInfo, setToggleInfo] = useState(false);
  const [toggleLang, setToggleLang] = useState(false);

  const { resolvedTheme, setTheme } = useTheme();

  const handleTheme = () => {
    resolvedTheme === 'dark' ? setTheme('light') : setTheme('dark');
  };

  return (
    <>
      <div
        className={`${styles.navbar} bg-[#F5F5F5] dark:bg-[#212121] fixed top-0 left-0 right-0`}>
        <div className={`${styles.nav_item}`}>
          <Link href="/" style={{ height: '24px' }}>
            <MdHome size={24} className="text-[#000000] dark:text-[#FFFFFF]" />
          </Link>
        </div>
        <div className={styles.pi_content}>
          <div className={`${styles.pi_cont1} text-black dark:text-white`}>
            Map of Pi
          </div>
          <div className={styles.pi_cont2}>
            <Image
              src="/images/logo.svg"
              width={48}
              height={48}
              alt="Logo image"
            />
          </div>
        </div>
        <div className="flex flex-row">
          <button
            className={styles.nav_item}
            onClick={() => setToggleInfo(true)}>
            <MdInfo size={24} className="text-[#000000] dark:text-[#FFFFFF]" />
          </button>
          <button onClick={handleTheme} className={styles.nav_item}>
            <MdBrightness4
              size={24}
              className="text-[#000000] dark:text-[#FFFFFF]"
            />
          </button>
          <button
            className={styles.nav_item}
            onClick={() => setToggleLang(true)}>
            <MdOutlineLanguage
              size={24}
              className="text-[#000000] dark:text-[#FFFFFF]"
            />
          </button>
        </div>
      </div>
      {/* THIS IS FOR INFO MODEL POP UP */}
      {toggleInfo && (
        <InfoModel toggleInfo={toggleInfo} setToggleInfo={setToggleInfo} />
      )}

      {/* THIS IS FOR LANGUAGE MODEL POP UP */}
      {toggleLang && (
        <LangModel toggleLang={toggleLang} setToggleLang={setToggleLang} />
      )}
    </>
  );
}

export default Navbar;
