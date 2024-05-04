// THIS IS INFO MODEL POP UP
'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import styles from './infoModel.module.css';
import { useRouter } from 'next/navigation';

const InfoModel = (props: any) => {

  const router = useRouter()
  const t = useTranslations();

  const [version, setVersion] = useState('V1.0.0');


  const handLinking = (route: any) => {
    router.push(`/${route}`)
    props.setToggleInfo(false)
  }

  return (
    <>
      {props.toggleInfo && (
        <div className={styles.model_container}>
          <div
            className={styles.model_event}
            onClick={() => props.setToggleInfo(false)}></div>
          <div className={styles.model_body}>
            <div className="flex justify-center mb-[10px]">
              <div className={styles.logo}>
                <Image src="/images/logo.svg" alt="Map of Pi" fill={true} />
              </div>
            </div>
            <div className={styles.title}>
              <h1>Map of Pi</h1>
            </div>
            <div className={`${styles.version} mb-[16px]`}>
              <h3>{version}</h3>
            </div>
            <div className="text-center">
              <button onClick={() => handLinking('privacy-policy')} className={styles.legal_link}>
                {t('FOOTER.PRIVACY_POLICY' || 'Privacy Policy')}
              </button>
              <button onClick={() => handLinking('terms-of-service')} className={styles.legal_link}>
                {t('FOOTER.TERMS_OF_SERVICE' || 'Terms of Service')}
              </button>
            </div>

            <div className={styles.social_media}>
              <div className={styles.social_media__links}>
                <Link
                  href="mailto:mapofpi@gmail.com"
                  className={styles.social_media__link}
                  target="_blank">
                  <Image
                    src="/images/shared/social-media/email-icon.svg"
                    alt="Map of Pi Email Address"
                    className={styles.social_media__icon}
                    fill={true}
                  />
                </Link>
                <Link
                  href="https://facebook.com/mapofpi"
                  className={styles.social_media__link}
                  target="_blank">
                  <Image
                    src="/images/shared/social-media/facebook.icon.png"
                    alt="Map of Pi Facebook Page"
                    className={styles.social_media__icon}
                    fill={true}
                  />
                </Link>
                <Link
                  href="https://instagram.com/mapofpi"
                  className={styles.social_media__link}
                  aria-label="Instagram page"
                  target="_blank">
                  <Image
                    src="/images/shared/social-media/instagram-icon.png"
                    alt="Map of Pi Instagram Page"
                    className={styles.social_media__icon}
                    fill={true}
                  />
                </Link>
                <Link
                  href="https://twitter.com/mapofpi"
                  className={styles.social_media__link}
                  target="_blank">
                  <Image
                    src="/images/shared/social-media/x-icon.png"
                    alt="Map of Pi Twitter Page"
                    className={styles.social_media__icon}
                    fill={true}
                  />
                </Link>
                <Link
                  href="https://tiktok.com/@mapofpi"
                  className={styles.social_media__link}
                  target="_blank">
                  <Image
                    src="/images/shared/social-media/tiktok-icon.svg"
                    alt="Map of Pi TikTok Channel"
                    className={styles.social_media__icon}
                    fill={true}
                  />
                </Link>
                <Link
                  href="https://youtube.com/@mapofpi"
                  className={styles.social_media__link}
                  target="_blank">
                  <Image
                    src="/images/shared/social-media/youtube-icon.png"
                    alt="Map of Pi YouTube Channel"
                    className={styles.social_media__icon}
                    fill={true}
                  />
                </Link>
              </div>
            </div>

            <div className={styles.defects_contact}>
              <span>{t('INFORMATION_DIALOG.REPORTING_MESSAGE') || 'Please report defects'} </span>
              <Link href="mailto:mapofpi@gmail.com" target="_blank">
                mapofpi@gmail.com
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoModel;
