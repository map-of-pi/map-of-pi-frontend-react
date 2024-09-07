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
import { Button, OutlineBtn2 } from '@/components/shared/Forms/Buttons/Buttons';
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
import TrustMeter from '../Review/TrustMeter';
import ToggleCollapse from '../Seller/ToggleCollapse';
import { Select } from '@/components/shared/Forms/Inputs/Inputs';

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
  const [userName, setUserName] = useState<string | undefined>();
  const [userSettings, setUserSettings] = useState<IUserSettings | null>(null);
  const [showInfoModel, setShowInfoModel] = useState(false);
  const [showPrivacyPolicyModel, setShowPrivacyPolicyModel] = useState(false);
  const [showTermsOfServiceModel, setShowTermsOfServiceModel] = useState(false);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    phone_number: '',
    findme: '',
  });

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
    
    // enable or disable save button based on form inputs
    const isFormFilled = Object.values(formData).some(v => v !== '');
    setIsSaveEnabled(isFormFilled);
  };

  const handlePhoneNumberChange = (value: string | undefined) => {
    setPhoneNumber(value);
    logger.debug(`Phone number changed to: ${value}`);
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
  const handleSave = async (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    
    let inputName = e.target.name;
    let inputValue = e.target.value;
    let searchCenter = JSON.parse(localStorage.getItem('mapCenter') || 'null'); // Provide default value

    logger.debug(`Input field blurred: ${inputName}, Value: ${inputValue}`);

    if (inputValue.trim() !== "") {
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
        logger.info('User settings submitted successfully:', { data });
        if (data.settings) {
          toast.success(t('SIDE_NAVIGATION.VALIDATION.SUCCESSFUL_PREFERENCES_SUBMISSION'));
        }
      } catch (error: any) {
        logger.error('Error submitting user settings:', { error });
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

  const translatedFindMeOptions = [
    {
      value: 'deviceGPS',
      name: t('Use my device GPS'),
    },
    {
      value: 'searchCenter',
      name: t('Use Search Center'),
    },
  ];

  return (
    <>
      <div className="w-full h-[calc(100vh-74px)] fixed bottom-0 bg-transparent right-0 z-[70]">
        <div
          className="absolute w-full h-full bg-[#82828284]"
          onClick={() => props.setToggleDis(false)}></div>
        <div
          className={`absolute bg-white right-0 top-0 z-50 p-[1.2rem] h-[calc(100vh-74px)] sm:w-[350px] w-[250px] overflow-y-auto`}>
          
          {/* header title */}
          <div className="mb-1 pb-3 text-center">
            <p className='text-sm text-gray-400'>{currentUser? currentUser.pi_username : ""}</p>
            <h1 className='text-2xl font-bold'>{t('SIDE_NAVIGATION.USER_PREFERENCES_HEADER')}</h1>
          </div>

          {/* set search center button */}
          <div className='mb-2'>
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
          </div>

          {/* user settings form fields */}
          <div className="flex flex-col justify-items-center mx-auto text-center gap-1">
            <Input
              label={t('Name')}
              placeholder={currentUser?.user_name}
              type="text"
              name="user_name"
              style={{
                textAlign: 'center'
              }}
              default={currentUser?.user_name}
              value={userSettings?.user_name? userSettings?.user_name: ""}
              onChange={handleChange}
            />
            <Input
              label={t('SIDE_NAVIGATION.EMAIL_ADDRESS_FIELD')}
              placeholder="mapofpi@mapofpi.com"
              type="email"
              name="email"
              style={{
                textAlign: 'center'
              }}
              value={userSettings?.email? userSettings?.email: ""}
              onChange={handleChange}
            />
            <TelephoneInput
              label={t('SIDE_NAVIGATION.PHONE_NUMBER_FIELD')}
              value={userSettings?.phone_number? userSettings?.phone_number: ""}
              name="phone_number"
              onChange={handlePhoneNumberChange}
              style={{
                textAlign: 'center'
              }}
            />

            <Button
              label={t('SHARED.SAVE')}
              // disabled={!isSaveEnabled}
              styles={{
                color: '#ffc153',
                height: '40px',
                width: '80px',
                padding: '10px 15px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
              onClick={handleSave}
            />

            {/* user review */}
            <div className='my-2'>
              <h3 className={`font-bold text-sm text-nowrap`}>Trust-o-meter</h3>
              <TrustMeter ratings={currentUser ? 50 : 100} hideLabel={true} />
            </div>             
            <Link href={currentUser ? `/seller/reviews/${currentUser?.pi_uid}` : '#'}>
              <OutlineBtn2
                label={t('SHARED.CHECK_REVIEWS')}
                styles={{
                  width: '80%',
                  padding: '8px',
                  borderWidth: '2px',
                  borderRadius: '10px',
                  fontSize: '18px',
                }}
                onClick={() => props.setToggleDis(false)} // Close sidebar on click
              />
            </Link>

            <div className='flex flex-col justify-items-center text-center mx-auto gap-2 my-4'>
              <ToggleCollapse
                header={t('Personalization')}>
                <div className="mb-2">
                  <FileInput
                    label={t('SHARED.PHOTO.UPLOAD_PHOTO_LABEL')}
                    images={[]}
                    handleAddImages={handleAddImages}
                  />
                </div>

                <Select
                  label={t('FindMe Preference')}
                  name="findme"
                  value={userSettings?.findme? userSettings.findme: "Use my device GPS"}
                  onChange={handleChange}
                  options={translatedFindMeOptions}
                />
                <div key={menu.Languages.id} className="">
                      <div
                        className={`${styles.slide_content} hover:bg-primary hover:text-yellow-500 outline outline-primary outline-[1.5px] w-full mb-3`}
                        onClick={() => handleMenu(menu.Languages.title, menu.Languages.url)}>
                        <Image
                          src={menu.Languages.icon}
                          alt={menu.Languages.title}
                          width={22}
                          height={22}
                          className=""
                        />
                        <span className="ml-3">
                          {translateMenuTitle(menu.Languages.title)}
                        </span>
                        {menu.Languages.children && (
                          <div className="ml-4">
                            <FaChevronDown
                              size={13}
                              className={`text-[#000000] ${toggle[menu.Languages.title] && 'rotate-90'}`}
                            />
                          </div>
                        )}
                      </div>
                      {/* MENU WITH CHILDREN */}
                      {menu.Languages.children &&
                        toggle[menu.Languages.title] &&
                        menu.Languages.children.map((child) => (
                          <div key={child.id} className="mx-auto">
                            <div
                              className={`${styles.slide_contentx} hover:bg-[#424242] hover:text-white `}
                              onClick={() =>
                                handleChildMenu(menu.Languages.title, child.code)
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
                              {menu.Languages.title === 'Languages' &&
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
              </ToggleCollapse>              
            </div>
            <div className='flex flex-col justify-items-center mx-auto text-center'>
              <ToggleCollapse header={t('About Map of Pi')}>
                  {menu.about.children.map((menuItem) => (
                    <div key={menuItem.id} className="">
                      <div
                        className={`${styles.slide_content} hover:bg-primary hover:text-yellow-500 outline outline-primary outline-[1.5px] mb-3`}
                        onClick={() => handleChildMenu(menu.about.title, menuItem.code)}
                      >
                        {/* Conditionally render icon only if it exists */}
                        {menuItem.icon && (
                          <Image
                            src={menuItem.icon}
                            alt={menuItem.title}
                            width={22}
                            height={22}
                            className=""
                          />
                        )}
                        <span className="">{translateMenuTitle(menuItem.title)}</span>
                      </div>
                    </div>
                  ))}
              </ToggleCollapse>
            </div>
            
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
