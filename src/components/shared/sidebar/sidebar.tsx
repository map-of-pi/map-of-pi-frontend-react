import styles from './sidebar.module.css';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useRef, useState, useContext, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import { toast } from 'react-toastify';

import InfoModel from '@/components/shared/About/Info/Info';
import PrivacyPolicyModel from '@/components/shared/About/privacy-policy/PrivacyPolicy';
import TermsOfServiceModel from '@/components/shared/About/terms-of-service/TermsOfService';
import { Button, OutlineBtn } from '@/components/shared/Forms/Buttons/Buttons';
import {
  FileInput,
  Input,
  Select,
  TelephoneInput,
} from '@/components/shared/Forms/Inputs/Inputs';
import { menu } from '@/constants/menu';
import { IUserSettings } from '@/constants/types';
import { createUserSettings, fetchUserSettings } from '@/services/userSettingsApi';
import TrustMeter from '../Review/TrustMeter';
import ToggleCollapse from '../Seller/ToggleCollapse';

import { AppContext } from '../../../../context/AppContextProvider';
import logger from '../../../../logger.config.mjs';

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
        logger.info('User settings fetched successfully.');
      } else {
        setUserSettings(null);
        logger.warn('User settings not found.');
      }
    };
    getUserSettings();
  }, []);

  useEffect(() => {
    if (userSettings) {
      setFormData({
        user_name: userSettings.user_name || '',
        email: userSettings.email || '',
        phone_number: userSettings.phone_number || '',
        findme: userSettings.findme || 'Use my device GPS',
      });
    }
  }, [userSettings]);

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
  const handleSave = async () => {

    if (formData) {    
      formData.phone_number = phoneNumber as string;

      try {
        const data = await createUserSettings(formData);
        logger.info('User settings submitted successfully:', { data });
        if (data.settings) {
          setIsSaveEnabled(false)
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

  const translateFindMeOptions = [
    {
      value: 'deviceGPS',
      name: t('SIDE_NAVIGATION.FIND_ME_OPTIONS.PREFERRED_DEVICE_GPS'),
    },
    {
      value: 'searchCenter',
      name: t('SIDE_NAVIGATION.FIND_ME_OPTIONS.PREFERRED_SEARCH_CENTER'),
    },
  ];

 return (
  <>
    <div className="w-full h-[calc(100vh-74px)] fixed bottom-0 bg-transparent right-0 z-[70]">
      <div className="absolute w-full h-full bg-[#82828284]" onClick={() => props.setToggleDis(false)}></div>
      <div className={`absolute bg-white right-0 top-0 z-50 p-[1.2rem] h-[calc(100vh-74px)] sm:w-[350px] w-[250px] overflow-y-auto`}>
        
        {/* header title */}
        <div className="mb-1 pb-3 text-center">
          <p className="text-sm text-gray-400">{currentUser ? currentUser.pi_username : ""}</p>
          <h1 className="text-2xl font-bold">{t('SIDE_NAVIGATION.USER_PREFERENCES_HEADER')}</h1>
        </div>

        {/* set search center button */}
        <div className="mb-2">
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
              router.push(`/map-center?entryType=search`);  // Use entryType=search
              props.setToggleDis(false);  // Close sidebar on click
            }}
          />
        </div>

        {/* user settings form fields */}
        <div className="flex flex-col justify-items-center mx-auto text-center gap-1">
          <Input
            label={t('SHARED.USER_INFORMATION.NAME_LABEL')}
            placeholder={currentUser?.user_name}
            type="text"
            name="user_name"
            style={{ textAlign: 'center' }}
            value={formData.user_name ? formData.user_name : ''}
            onChange={handleChange}
          />
          <Input
            label={t('SIDE_NAVIGATION.EMAIL_ADDRESS_FIELD')}
            placeholder="mapofpi@mapofpi.com"
            type="email"
            name="email"
            style={{ textAlign: 'center' }}
            value={formData.email ? formData.email : ""}
            onChange={handleChange}
          />
          <TelephoneInput
            label={t('SIDE_NAVIGATION.PHONE_NUMBER_FIELD')}
            value={phoneNumber}
            name="phone_number"
            onChange={handlePhoneNumberChange}
            style={{ textAlign: 'center' }}
          />

          {/* Check reviews button */}
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
              onClick={() => props.setToggleDis(false)}  // Close sidebar on click
            />
          </Link>
        </div>

        {/* Save button and Trust-o-meter */}
        <Button
          label={t('SHARED.SAVE')}
          disabled={!isSaveEnabled}
          styles={{
            color: '#ffc153',
            height: '40px',
            width: '80px',
            padding: '10px 15px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          onClick={handleSave}
        />

        <div className="my-2">
          <h3 className="font-bold text-sm text-nowrap">Trust-o-meter</h3>
          <TrustMeter ratings={currentUser ? 50 : 100} hideLabel={true} />
        </div>

        {/* Photo upload */}
        <div className="pt-5">
          <FileInput
            label={t('SHARED.PHOTO.UPLOAD_PHOTO_LABEL')}
            images={[]}
            handleAddImages={handleAddImages}
          />
        </div>

        {/* Menu and other components */}
        <div className="pt-5">
          {menu.map((menu) => (
            <div key={menu.id}>
              <div
                className="hover:bg-primary hover:text-yellow-500 outline outline-primary outline-[1.5px] w-full mb-3"
                onClick={() => handleMenu(menu.title, menu.url)}
              >
                <Image src={menu.icon} alt={menu.title} width={22} height={22} />
                <span className="ml-3">{translateMenuTitle(menu.title)}</span>
                {menu.children && (
                  <div className="ml-4">
                    <FaChevronDown size={13} className={`text-[#000000] ${toggle[menu.title] && 'rotate-90'}`} />
                  </div>
                )}
              </div>
              {menu.children && toggle[menu.title] && menu.children.map((child) => (
                <div key={child.id} className="ml-6">
                  <div
                    className="hover:bg-[#424242] hover:text-white"
                    onClick={() => handleChildMenu(menu.title, child.code)}
                  >
                    {child.icon && (
                      <Image src={child.icon} alt={child.title} width={17} height={17} />
                    )}
                    <span className="ml-2">{translateChildMenuTitle(child.title)}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div ref={bottomRef}></div>
      </div>
    </div>
    <InfoModel toggleInfo={showInfoModel} setToggleInfo={setShowInfoModel} />
    <PrivacyPolicyModel togglePrivacyPolicy={showPrivacyPolicyModel} setTogglePrivacyPolicy={setShowPrivacyPolicyModel} />
    <TermsOfServiceModel toggleTermsOfService={showTermsOfServiceModel} setToggleTermsOfService={setShowTermsOfServiceModel} />
  </>
);

export default Sidebar;

