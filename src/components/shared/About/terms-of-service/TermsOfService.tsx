'use client';

import styles from './TermOfService.module.css';

import { useTranslations } from 'next-intl';

import { CloseButton } from '@/components/shared/Forms/Buttons/Buttons';

const TermsOfServiceModel = (props: any) => {

  const t = useTranslations();

  const lastUpdated = "6/3/2024";
  const emailAddress = "philip@mapofpi.com";

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
              <h2><strong className='whitespace-nowrap'>Map of Pi {t('POPUP.TERMS_OF_SERVICE_INFO.TITLE')}</strong></h2>
              <h4>{t('POPUP.TERMS_OF_SERVICE_INFO.LAST_UPDATED')}: {lastUpdated}</h4>
              <h4>{t('POPUP.TERMS_OF_SERVICE_INFO.EMAIL_ADDRESS')}: {emailAddress}</h4>
              <br />
              <h2>1. {t('POPUP.TERMS_OF_SERVICE_INFO.SECTIONS.HEADER_1')}</h2>
              <ul>
                  <li>{t('POPUP.TERMS_OF_SERVICE_INFO.SECTIONS.CONTENT_1_1')}</li>
              </ul>

              <h2>2. {t('POPUP.TERMS_OF_SERVICE_INFO.SECTIONS.HEADER_2')}</h2>
              <ul>
                  <li>{t('POPUP.TERMS_OF_SERVICE_INFO.SECTIONS.CONTENT_2_1')}</li>
                  <li>{t('POPUP.TERMS_OF_SERVICE_INFO.SECTIONS.CONTENT_2_2')}</li>
                  <li>{t('POPUP.TERMS_OF_SERVICE_INFO.SECTIONS.CONTENT_2_3')}</li>
              </ul>

              <h2>3. {t('POPUP.TERMS_OF_SERVICE_INFO.SECTIONS.HEADER_3')}</h2>
              <ul>
                  <li>{t('POPUP.TERMS_OF_SERVICE_INFO.SECTIONS.CONTENT_3_1')}</li>
              </ul>

              <h2>4. {t('POPUP.TERMS_OF_SERVICE_INFO.SECTIONS.HEADER_4')}</h2>
              <ul>
                  <li>{t('POPUP.TERMS_OF_SERVICE_INFO.SECTIONS.CONTENT_4_1')}</li>
              </ul>

              <h2>5. {t('POPUP.TERMS_OF_SERVICE_INFO.SECTIONS.HEADER_5')}</h2>
              <ul>
                  <li>{t('POPUP.TERMS_OF_SERVICE_INFO.SECTIONS.CONTENT_5_1')}</li>
              </ul>

              <h2>6. {t('POPUP.TERMS_OF_SERVICE_INFO.SECTIONS.HEADER_6')}</h2>
              <ul>
                  <li>{t('POPUP.TERMS_OF_SERVICE_INFO.SECTIONS.CONTENT_6_1')}</li>
              </ul>

              <h2>7. {t('POPUP.TERMS_OF_SERVICE_INFO.SECTIONS.HEADER_7')}</h2>
              <ul>
                  <li>{t('POPUP.TERMS_OF_SERVICE_INFO.SECTIONS.CONTENT_7_1')}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TermsOfServiceModel;
