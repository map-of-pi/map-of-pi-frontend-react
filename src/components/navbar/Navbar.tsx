'use client';

import React, { useState } from 'react';
import styles from '@/components/navbar/Navbar.module.css';
import Link from 'next/link';
import Image from 'next/image';

import {
  MdHome,
  MdBrightness4,
  MdInfo,
  MdOutlineLanguage,
} from 'react-icons/md';

import LogoImage from '../../../public/images/logo.svg';
import InfoModel from '../Models/InfoModel/InfoModel';
import LangModel from '../Models/LangModel/LangModel';

function Navbar() {
  const [toggleInfo, setToggleInfo] = useState(false);
  const [toggleLang, setToggleLang] = useState(false);

  return (
    <>
      <div className={styles.navbar}>
        <div className={`${styles.nav_item}`}>
          <Link href="/" style={{ height: '24px' }}>
            <MdHome size={24} color="#000000" />
          </Link>
        </div>
        <div className={styles.pi_content}>
          <div className={styles.pi_cont1}>Map of Pi</div>
          <div className={styles.pi_cont2}>
            <Image src={LogoImage} width={48} height={48} alt="Logo image" />
          </div>
        </div>
        <div className="flex flex-row">
          <button
            className={styles.nav_item}
            onClick={() => setToggleInfo(true)}>
            <MdInfo size={24} />
          </button>
          <button
            className={styles.nav_item}
            
            >
            <MdBrightness4 size={24} />
          </button>
          <button className={styles.nav_item}
          onClick={() => setToggleLang(true)}
          >
            <MdOutlineLanguage size={24} />
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
