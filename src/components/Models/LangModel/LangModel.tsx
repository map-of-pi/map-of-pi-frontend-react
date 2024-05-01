// THIS IS LANGUAGE MODEL POP UP
'use client'


import Image from 'next/image';

import styles from './LangModel.module.css';

// import { useParams } from 'next/navigation';
// import {usePathname, useRouter} from '../../../navigation';
import { usePathname, useRouter, useParams } from 'next/navigation';

export interface LangMenuItem {
  code: string;
  label: string;
  name: string;
  translation: string;
  imageUrl: string;
}


const LangModel = (props: any) => {
  const Languages: LangMenuItem[] = [
    {
      code: 'en',
      label: 'EN',
      name: 'English',
      translation: 'English',
      imageUrl: '/images/shared/language/en.svg',
    },
    {
      code: 'es',
      label: 'ES',
      name: 'Spanish',
      translation: 'Español',
      imageUrl: '/images/shared/language/es.svg',
    },
    {
      code: 'ko',
      label: 'KO',
      name: 'Korean',
      translation: '한국어',
      imageUrl: '/images/shared/language/ko.svg',
    },
    {
      code: 'ng_hau',
      label: 'NG/HAU',
      name: 'Nigerian Hausa',
      translation: 'Hausa',
      imageUrl: '/images/shared/language/ng.svg',
    },
    {
      code: 'ng_ibo',
      label: 'NG/IBO',
      name: 'Nigerian Igbo',
      translation: 'Igbo',
      imageUrl: '/images/shared/language/ng.svg',
    },
    {
      code: 'ng_yor',
      label: 'NG/YOR',
      name: 'Nigerian Yoruba',
      translation: 'Yorùbá',
      imageUrl: '/images/shared/language/ng.svg',
    },
  ];

  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();



  const handleLanguageChange = (code: string) => {
    const slip =  pathname.split('/').slice(2)
    slip.unshift(code)
   const xxx = slip.join('/')
   xxx.toString()
    console.log(xxx)
    router.replace(`/${xxx}`)
  };

  return (
    <>
      <div
        className={styles.lang_cover}
        onClick={() => props.setToggleLang(false)}></div>
      <div
        className={styles.lang_container}
        style={{ backgroundColor: 'white' }}>
        {Languages.map((lang, i) => (
          <div
            key={lang.code}
            className={`${styles.lang_section} mb-2`}
            onClick={() => handleLanguageChange(lang.code)}>
            <div className={styles.lan_img_con}>
              <div className="min-w-6 min-h-6 relative">
                <Image src={lang.imageUrl} alt={lang.name} fill />
              </div>
            </div>
            <div className="ml-[1rem] flex flex-col">
              <span className="font-bold text-sm">{lang.label}</span>
              <span className="block text-xs">{lang.translation}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default LangModel;
