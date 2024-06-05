'use client';

import styles from './TermOfService.module.css';

import { useTranslations } from 'next-intl';

import { CloseButton } from '@/components/shared/Forms/Buttons/Buttons';

const TermsOfServiceModel = (props: any) => {

  const t = useTranslations();

  const lastUpdated = "6/3/2024";
  const emailAddress = "email@mapofpi.com";

  return (
    <>
      {props.toggleTermsOfService && (
        <div className={styles.model_container}>
          <div
            className={styles.model_event}
            onClick={() => props.setToggleTermsOfService(false)}>
          </div>
          <div className={styles.model_body}>
          <CloseButton onClick={() => props.setToggleTermsOfService(false)}/>
            <div className={styles.terms_of_service_content}>
              <h2><strong>Map of Pi {t('TERMS_OF_SERVICE.TITLE')}</strong></h2>
              <h4>{t('TERMS_OF_SERVICE.LAST_UPDATED')}: {lastUpdated}</h4>
              <h4>{t('TERMS_OF_SERVICE.EMAIL_ADDRESS')}: {emailAddress}</h4>
              <br />
              <h2>1. {t('TERMS_OF_SERVICE.SECTIONS.HEADER_1')}</h2>
              <ul>
                  <li>{t('TERMS_OF_SERVICE.SECTIONS.CONTENT_1_1')}</li>
              </ul>

              <h2>2. {t('TERMS_OF_SERVICE.SECTIONS.HEADER_2')}</h2>
              <ul>
                  <li>{t('TERMS_OF_SERVICE.SECTIONS.CONTENT_2_1')}</li>
                  <li>{t('TERMS_OF_SERVICE.SECTIONS.CONTENT_2_2')}</li>
                  <li>{t('TERMS_OF_SERVICE.SECTIONS.CONTENT_2_3')}</li>
              </ul>

              <h2>3. {t('TERMS_OF_SERVICE.SECTIONS.HEADER_3')}</h2>
              <ul>
                  <li>{t('TERMS_OF_SERVICE.SECTIONS.CONTENT_3_1')}</li>
              </ul>

              <h2>4. {t('TERMS_OF_SERVICE.SECTIONS.HEADER_4')}</h2>
              <ul>
                  <li>{t('TERMS_OF_SERVICE.SECTIONS.CONTENT_4_1')}</li>
              </ul>

              <h2>5. {t('TERMS_OF_SERVICE.SECTIONS.HEADER_5')}</h2>
              <ul>
                  <li>{t('TERMS_OF_SERVICE.SECTIONS.CONTENT_5_1')}</li>
              </ul>

              <h2>6. {t('TERMS_OF_SERVICE.SECTIONS.HEADER_6')}</h2>
              <ul>
                  <li>{t('TERMS_OF_SERVICE.SECTIONS.CONTENT_6_1')}</li>
              </ul>

              <h2>7. {t('TERMS_OF_SERVICE.SECTIONS.HEADER_7')}</h2>
              <ul>
                  <li>{t('TERMS_OF_SERVICE.SECTIONS.CONTENT_7_1')}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TermsOfServiceModel;
