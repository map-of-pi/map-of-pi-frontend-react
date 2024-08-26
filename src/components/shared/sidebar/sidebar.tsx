import styles from './sidebar.module.css';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';

import { useRef, useState, useContext, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import { toast } from 'react-toastify';

import InfoModel from '@/components/shared/About/Info/Info';
import PrivacyPolicyModel from '@/components/shared/About/privacy-policy/PrivacyPolicy';
import TermsOfServiceModel from '@/components/shared/About/terms-of-service/TermsOfService';
import { Button } from '@/components/shared/Forms/Buttons/Buttons';
import {
  FileInput,
  Input,
  TelephoneInput,
} from '@/components/shared/Forms/Inputs/Inputs';
import { menu } from '@/constants/menu';
import { IUserSettings } from '@/constants/types';
import { createUserSettings, fetchUserSettings } from '@/services/userSettingsApi';

import { AppContext } from '../../../../context/AppContextProvider';
import logger from '../../../../logger.config.mjs';

// type definitions for menu items
interface MenuItem {
  id: number;
  title: string;
  icon: string;
  url?: string;
  code?: string;
  children?: MenuItem[];
}

interface LanguageMenuItem extends MenuItem {
  code: string;
  label: string;
  translation: string;
}

// type guard function to check if a menu item is a LanguageMenuItem
function isLanguageMenuItem(item: MenuItem): item is LanguageMenuItem {
  return (item as LanguageMenuItem).translation !== undefined;
}

function Sidebar(props: any) {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();

  const { resolvedTheme, setTheme } = useTheme();
  const [toggle, setToggle] = useState<any>({
    Themes: false,
    Languages: false,
  });
  const { currentUser, autoLoginUser } = useContext(AppContext);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [userSettings, setUserSettings] = useState<IUserSettings | null>(null);
  const [showInfoModel, setShowInfoModel] = useState(false);
  const [showPrivacyPolicyModel, setShowPrivacyPolicyModel] = useState(false);
  const [showTermsOfServiceModel, setShowTermsOfServiceModel] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      logger.info("User not logged in; attempting auto-login..");
      autoLoginUser();
    }

    const getUserSettings = async () => {
      logger.debug('Fetching user settings..');
      const settings = await fetchUserSettings();
      if (settings) {
        setUserSettings(settings);
        setPhoneNumber(settings.phone_number?.toString());
        setEmail(settings.email || '');
        logger.info('User settings fetched successfully.');
      } else {
        setUserSettings(null);
        logger.warn('User settings not found.');
      }
    };
    getUserSettings();
  }, []);

  const handlePhoneNumberChange = (value: string | undefined) => {
    setPhoneNumber(value);
    logger.debug(`Phone number changed to: ${value}`);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    logger.debug(`Email changed to: ${e.target.value}`);
  };

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleAddImages = () => {
    logger.debug('Add images handler triggered.');
  };

  const handleMenu = (title: any, url: string) => {
    logger.debug(`Menu item selected: ${title}, URL: ${url}`);
    if (
      title !== 'Themes' &&
      title !== 'Languages' &&
      title !== 'About Map of Pi'
    ) {
      router.push(url);
      props.setToggleDis(false);
    }
  
    if (
      title === 'Themes' ||
      title === 'Languages' ||
      title === 'About Map of Pi'
    ) {
      setToggle({ ...toggle, [title]: !toggle[title] });
      
    }
    if (toggle[title] === false) {
      setTimeout(() => {
        bottomRef.current!.scrollIntoView({ behavior: 'smooth' });
      }, 90);
    }
  };
  
  const handleChildMenu = (title: any, code: string) => {
    logger.debug(`Child menu item selected: ${title}, Code: ${code}`);
    if (title === 'Languages') {
      const slipPathname = pathname.split('/').slice(2);
      slipPathname.unshift(code);
      const retPathname = slipPathname.join('/');
      retPathname.toString();
      router.replace(`/${retPathname}`);
      props.setToggleDis(false);
    }
    if (title === 'Themes') {
      code === 'dark' ? setTheme('dark') : setTheme('light');
      props.setToggleDis(false);
    }
    if (title === 'About Map of Pi') {
      if (code === 'version') {
        setShowInfoModel(true);
      } else if (code === 'privacy-policy') {
        setShowPrivacyPolicyModel(true);
      } else if (code === 'tos') {
        setShowTermsOfServiceModel(true);
      }
    }
  };

  // Function to submit user preference settings to the database
  const handleFocusChange = async (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    let inputName = e.target.name;
    let inputValue = e.target.value;
    let searchCenter = JSON.parse(localStorage.getItem('mapCenter') || 'null'); // Provide default value

    logger.debug(`Input field blurred: ${inputName}, Value: ${inputValue}`);

    if (inputValue !== "") {
      const userSettingsData: IUserSettings = {
        [inputName]: inputValue,
      };

      if (searchCenter) {
        userSettingsData.search_map_center = {
          type: 'Point' as const,
          coordinates: [searchCenter[0], searchCenter[1]] as [number, number]
        };
      }

      try {
        const data = await createUserSettings(userSettingsData);
        logger.info(`User settings submitted successfully: ${data.settings}`);
        if (data.settings) {
          toast.success(t('SIDE_NAVIGATION.VALIDATION.SUCCESSFUL_PREFERENCES_SUBMISSION'));
        }
      } catch (error: any) {
        logger.error(`Error submitting user settings: ${error}`);
        toast.error(t('SIDE_NAVIGATION.VALIDATION.UNSUCCESSFUL_PREFERENCES_SUBMISSION'));
      }
    } else {
      return null;
    }
  };

  const translateMenuTitle = (title: string): string => {
    switch (title) {
      case 'Languages':
        return t('SIDE_NAVIGATION.LANGUAGES');
      case 'About Map of Pi':
        return t('SIDE_NAVIGATION.ABOUT.ABOUT_MAP_OF_PI');
      case 'Contact Map of Pi':
        return t('SIDE_NAVIGATION.CONTACT_MAP_OF_PI');
      default:
        return title;
    }
  };

  const translateChildMenuTitle = (title: string): string => {
    switch (title) {
      case 'App Version':
        return t('SIDE_NAVIGATION.ABOUT.APP_VERSION');
      case 'Privacy Policy':
        return t('SIDE_NAVIGATION.ABOUT.PRIVACY_POLICY');
      case 'Terms of Service':
        return t('SIDE_NAVIGATION.ABOUT.TERMS_OF_SERVICE');
      default:
        return title;
    }
  };

  return (
    <>
      <div className="w-full h-[calc(100vh-74px)] fixed bottom-0 bg-transparent right-0 z-[70]">
        <div
          className="absolute w-full h-full bg-[#82828284]"
          onClick={() => props.setToggleDis(false)}></div>
        <div
          className={`absolute bg-white right-0 top-0 z-50 p-[1.2rem] h-[calc(100vh-74px)] sm:w-[350px] w-[250px] overflow-y-auto`}>
          <div className="text-2xl font-bold mb-2 pb-3">
            {t('SIDE_NAVIGATION.USER_PREFERENCES_HEADER')}
          </div>
          <div className="">
            <Input
              label={t('SIDE_NAVIGATION.EMAIL_ADDRESS_FIELD')}
              placeholder="mapofpi@mapofpi.com"
              type="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleFocusChange}
            />
            <TelephoneInput
              label={t('SIDE_NAVIGATION.PHONE_NUMBER_FIELD')}
              value={phoneNumber}
              name="phone_number"
              onChange={handlePhoneNumberChange}
              onBlur={handleFocusChange}
            />
            <div className="pt-2 flex flex-col gap-5">
              <Button
                label={t('SHARED.SEARCH_CENTER')}
                styles={{
                  color: '#ffc153',
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  fontSize: '18px',
                }}
                onClick={() => {
                  router.push('/map-center');
                  props.setToggleDis(false); // Close sidebar on click
                }}
              />
              <Link href={currentUser ? `/seller/reviews/${currentUser?.pi_uid}` : '#'}>
                <Button
                  label={t('SHARED.CHECK_REVIEWS')}
                  styles={{
                    background: '#fff',
                    color: '#ffc153',
                    width: '100%',
                    padding: '8px',
                    borderColor: 'var(--default-primary-color)',
                    borderWidth: '2px',
                    borderRadius: '10px',
                    fontSize: '18px',
                  }}
                  onClick={() => props.setToggleDis(false)} // Close sidebar on click
                />
              </Link>
            </div>
            <div className="pt-5">
              <FileInput
                label={t('SHARED.PHOTO.UPLOAD_PHOTO_LABEL')}
                images={[]}
                handleAddImages={handleAddImages}
              />
            </div>
          </div>
          <div className="pt-5">
            {menu.map((menu) => (
              <>
                <div key={menu.id} className="">
                  <div
                    className={`${styles.slide_content} hover:bg-[#424242] hover:text-white`}
                    onClick={() => handleMenu(menu.title, menu.url)}>
                    <Image
                      src={menu.icon}
                      alt={menu.title}
                      width={22}
                      height={22}
                      className=""
                    />
                    <span className="ml-2">
                      {translateMenuTitle(menu.title)}
                    </span>
                    {menu.children && (
                      <div className="ml-4">
                        <FaChevronDown
                          size={13}
                          className={`text-[#000000] ${toggle[menu.title] && 'rotate-90'}`}
                        />
                      </div>
                    )}
                  </div>
                  {/* MENU WITH CHILDREN */}
                  {menu.children &&
                    toggle[menu.title] &&
                    menu.children.map((child) => (
                      <div key={child.id} className="ml-6">
                        <div
                          className={`${styles.slide_contentx} hover:bg-[#424242] hover:text-white `}
                          onClick={() =>
                            handleChildMenu(menu.title, child.code)
                          }>
                          {child.icon && ( // conditional rendering
                            <Image
                              src={child.icon}
                              alt={child.title}
                              width={17}
                              height={17}
                              className={styles.lng_img}
                            />
                          )}
                          {menu.title === 'Languages' &&
                          isLanguageMenuItem(child) ? (
                            <div className="ml-2 text-[14px] flex">
                              <div className="font-bold">{child.label}</div>
                              <div className="mx-1"> - </div>
                              <div>{child.translation}</div>
                            </div>
                          ) : (
                            <span className="ml-2 text-[14px]">
                              {translateChildMenuTitle(child.title)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </>
            ))}
          </div>
          <div ref={bottomRef}></div>
        </div>
      </div>
      <InfoModel toggleInfo={showInfoModel} setToggleInfo={setShowInfoModel} />
      <PrivacyPolicyModel
        togglePrivacyPolicy={showPrivacyPolicyModel}
        setTogglePrivacyPolicy={setShowPrivacyPolicyModel}
      />
      <TermsOfServiceModel
        toggleTermsOfService={showTermsOfServiceModel}
        setToggleTermsOfService={setShowTermsOfServiceModel}
      />
    </>
  );
}

export default Sidebar;
