// THIS IS INFO MODEL POP UP

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import styles from './infoModel.module.css';

const InfoModel = (props: any) => {
  const [version, setVersion] = useState('Beta V2.2.6');

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
              <Link href="" className={styles.legal_link}>
                Privacy Policy
              </Link>
              <Link href="" className={styles.legal_link}>
                Terms of Service
              </Link>
            </div>

            <div className={styles.social_media}>
              <div className={styles.social_media__links}>
                <Link
                  href="mailto:mapofpi@gmail.com"
                  className={styles.social_media__link}
                  target="_blank">
                  <Image
                    src="/images/shared/footer/email-icon.svg"
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
                    src="/images/shared/footer/facebook.icon.png"
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
                    src="/images/shared/footer/instagram-icon.png"
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
                    src="/images/shared/footer/x-icon.png"
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
                    src="/images/shared/footer/tiktok-icon.svg"
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
                    src="/images/shared/footer/youtube-icon.png"
                    alt="Map of Pi YouTube Channel"
                    className={styles.social_media__icon}
                    fill={true}
                  />
                </Link>
              </div>
            </div>

            <div className={styles.defects_contact}>
              <Link href="mailto:mapofpi@gmail.com" target="_blank">
                <span>Please report defects to mapofpi@gmail.com </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoModel;
