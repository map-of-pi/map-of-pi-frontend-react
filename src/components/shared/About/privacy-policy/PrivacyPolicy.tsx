'use client';

import styles from './PrivacyPolicy.module.css';

import { useTranslations } from 'next-intl';

import { CloseButton } from '@/components/shared/Forms/Buttons/Buttons';

const PrivacyPolicyModel = (props: any) => {
  const t = useTranslations();

  const lastUpdated = '6/3/2024';
  const emailAddress = 'philip@mapofpi.com';

  return (
    <>
      {props.togglePrivacyPolicy && (
        <div className={styles.model_container}>
          <div
            className={styles.model_event}
            onClick={() => props.setTogglePrivacyPolicy(false)}>
          </div>
          <div className={styles.model_body}>
            <CloseButton onClick={() => props.setTogglePrivacyPolicy(false)}/>
            <div className={styles.privacy_policy_content}>
              <h2><strong className='whitespace-nowrap'>Map of Pi {t('POPUP.PRIVACY_POLICY_INFO.TITLE')}</strong></h2>
              <h4>{t('POPUP.PRIVACY_POLICY_INFO.LAST_UPDATED')}: {lastUpdated}</h4>
              <h4>{t('POPUP.PRIVACY_POLICY_INFO.EMAIL_ADDRESS')}: {emailAddress}</h4>
              <br />

              <h2>1. {t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.HEADER_1')}</h2>
              <ul>
                <li>{t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.CONTENT_1')}</li>
              </ul>

              <h2>2. {t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.HEADER_2')}</h2>
              <ul>
                <li>
                  <strong>2.1 {t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.SUBHEADER_2_1')}</strong>
                  <ul>
                    <li>{t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.CONTENT_2_1_1')}</li>
                    <li>{t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.CONTENT_2_1_2')}</li>
                  </ul>
                </li>
                <li>
                  <strong>2.2 {t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.SUBHEADER_2_2')}</strong>
                  <ul>
                    <li>{t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.CONTENT_2_2_1')}</li>
                  </ul>
                </li>
              </ul>

              <h2>3. {t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.HEADER_3')}</h2>
              <ul>
                <li>
                  <strong>3.1 {t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.SUBHEADER_3_1')}</strong>
                  <ul>
                    <li>{t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.CONTENT_3_1_1')}</li>
                  </ul>
                </li>
                <li>
                  <strong>3.2 {t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.SUBHEADER_3_2')}</strong>
                  <ul>
                    <li>{t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.CONTENT_3_2_1')}</li>
                  </ul>
                </li>
                <li>
                  <strong>3.3 {t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.SUBHEADER_3_3')}</strong>
                  <ul>
                    <li>{t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.CONTENT_3_3_1')}</li>
                  </ul>
                </li>
              </ul>

              <h2>4. {t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.HEADER_4')}</h2>
              <ul>
                <li>
                  <strong>4.1 {t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.SUBHEADER_4_1')}</strong>
                  <ul>
                    <li>{t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.CONTENT_4_1_1')}</li>
                  </ul>
                </li>
                <li>
                  <strong>4.2 {t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.SUBHEADER_4_2')}</strong>
                  <ul>
                    <li>{t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.CONTENT_4_2_1')}</li>
                  </ul>
                </li>
              </ul>

              <h2>5. {t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.HEADER_5')}</h2>
              <ul>
                <li>{t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.CONTENT_5_1')}</li>
              </ul>

              <h2>6. {t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.HEADER_6')}</h2>
              <ul>
                <li>{t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.CONTENT_6_1')}</li>
              </ul>
              <h2>7. {t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.HEADER_7')}</h2>
              <ul>
                <li>{t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.CONTENT_7_1')}</li>
              </ul>

              <h2>8. {t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.HEADER_8')}</h2>
              <ul>
                <li>
                  {t('POPUP.PRIVACY_POLICY_INFO.SECTIONS.CONTENT_8_1')}
                  <strong>
                    <a href={`mailto:${emailAddress}`}>{' ' + emailAddress}</a>
                  </strong>
                  .
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PrivacyPolicyModel;
