'use client';

import styles from './PrivacyPolicy.module.css';

import { useTranslations } from 'next-intl';

import { CloseButton } from '@/components/shared/Forms/Buttons/Buttons';

const PrivacyPolicyModel = (props: any) => {
  
  const t = useTranslations();

  const lastUpdated = '6/3/2024';
  const emailAddress = 'email@mapofpi.com';

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
              <h2><strong>Map of Pi {t('PRIVACY_POLICY.TITLE')}</strong></h2>
              <h4>{t('PRIVACY_POLICY.LAST_UPDATED')}: {lastUpdated}</h4>
              <h4>{t('PRIVACY_POLICY.EMAIL_ADDRESS')}: {emailAddress}</h4>
              <br />

              <h2>1. {t('PRIVACY_POLICY.SECTIONS.HEADER_1')}</h2>
              <ul>
                <li>{t('PRIVACY_POLICY.SECTIONS.CONTENT_1')}</li>
              </ul>

              <h2>2. {t('PRIVACY_POLICY.SECTIONS.HEADER_2')}</h2>
              <ul>
                <li>
                  <strong>2.1 {t('PRIVACY_POLICY.SECTIONS.SUBHEADER_2_1')}</strong>
                  <ul>
                    <li>{t('PRIVACY_POLICY.SECTIONS.CONTENT_2_1_1')}</li>
                    <li>{t('PRIVACY_POLICY.SECTIONS.CONTENT_2_1_2')}</li>
                  </ul>
                </li>
                <li>
                  <strong>2.2 {t('PRIVACY_POLICY.SECTIONS.SUBHEADER_2_2')}</strong>
                  <ul>
                    <li>{t('PRIVACY_POLICY.SECTIONS.CONTENT_2_2_1')}</li>
                  </ul>
                </li>
              </ul>

              <h2>3. {t('PRIVACY_POLICY.SECTIONS.HEADER_3')}</h2>
              <ul>
                <li>
                  <strong>3.1 {t('PRIVACY_POLICY.SECTIONS.SUBHEADER_3_1')}</strong>
                  <ul>
                    <li>{t('PRIVACY_POLICY.SECTIONS.CONTENT_3_1_1')}</li>
                  </ul>
                </li>
                <li>
                  <strong>3.2 {t('PRIVACY_POLICY.SECTIONS.SUBHEADER_3_2')}</strong>
                  <ul>
                    <li>{t('PRIVACY_POLICY.SECTIONS.CONTENT_3_2_1')}</li>
                  </ul>
                </li>
                <li>
                  <strong>3.3 {t('PRIVACY_POLICY.SECTIONS.SUBHEADER_3_3')}</strong>
                  <ul>
                    <li>{t('PRIVACY_POLICY.SECTIONS.CONTENT_3_3_1')}</li>
                  </ul>
                </li>
              </ul>

              <h2>4. {t('PRIVACY_POLICY.SECTIONS.HEADER_4')}</h2>
              <ul>
                <li>
                  <strong>4.1 {t('PRIVACY_POLICY.SECTIONS.SUBHEADER_4_1')}</strong>
                  <ul>
                    <li>{t('PRIVACY_POLICY.SECTIONS.CONTENT_4_1_1')}</li>
                  </ul>
                </li>
                <li>
                  <strong>4.2 {t('PRIVACY_POLICY.SECTIONS.SUBHEADER_4_2')}</strong>
                  <ul>
                    <li>{t('PRIVACY_POLICY.SECTIONS.CONTENT_4_2_1')}</li>
                  </ul>
                </li>
              </ul>

              <h2>5. {t('PRIVACY_POLICY.SECTIONS.HEADER_5')}</h2>
              <ul>
                <li>{t('PRIVACY_POLICY.SECTIONS.CONTENT_5_1')}</li>
              </ul>

              <h2>6. {t('PRIVACY_POLICY.SECTIONS.HEADER_6')}</h2>
              <ul>
                <li>{t('PRIVACY_POLICY.SECTIONS.CONTENT_6_1')}</li>
              </ul>
              <h2>7. {t('PRIVACY_POLICY.SECTIONS.HEADER_7')}</h2>
              <ul>
                <li>{t('PRIVACY_POLICY.SECTIONS.CONTENT_7_1')}</li>
              </ul>

              <h2>8. {t('PRIVACY_POLICY.SECTIONS.HEADER_8')}</h2>
              <ul>
                <li>
                  {t('PRIVACY_POLICY.SECTIONS.CONTENT_8_1')}
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
