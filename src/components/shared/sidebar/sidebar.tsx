import styles from './sidebar.module.css';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useRef, useState, useContext, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import { toast } from 'react-toastify';

import MapCenter from '../map/MapCenter';
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

  const { currentUser, autoLoginUser } = useContext(AppContext);
  const [dbUserSettings, setDbUserSettings] = useState<IUserSettings | null>(null);
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    phone_number: '',
    image: '',
    findme: '',
    trust_meter_rating: 100,
  });
  const { resolvedTheme, setTheme } = useTheme();
  const [toggle, setToggle] = useState<any>({
    Themes: false,
    Languages: false,
  });
 
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(dbUserSettings?.image || '');
  const [showMapCenter] = useState(false);
  const [showInfoModel, setShowInfoModel] = useState(false);
  const [showPrivacyPolicyModel, setShowPrivacyPolicyModel] = useState(false);
  const [showTermsOfServiceModel, setShowTermsOfServiceModel] = useState(false);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      logger.info("User not logged in; attempting auto-login..");
      autoLoginUser();
    }

    const getUserSettingsData = async () => {
      try {
        const data = await fetchUserSettings();
        if (data) {
          logger.info('Fetched user settings data successfully:', { data });
          setDbUserSettings(data);
        } else {
          logger.warn('User Settings not found.');
          setDbUserSettings(null);
        }
      } catch (error) {
        logger.error('Error fetching user settings data:', { error });
      }
    };
    getUserSettingsData();
  }, []);

  // Initialize formData with dbUserSettings values if available
  useEffect(() => {
    if (dbUserSettings) {
      setFormData({
        user_name: dbUserSettings.user_name || '',
        email: dbUserSettings.email || '',
        phone_number: dbUserSettings.phone_number?.toString() || '',
        image: dbUserSettings.image || '',
        findme: dbUserSettings.findme || t('SIDE_NAVIGATION.FIND_ME_OPTIONS.PREFERRED_DEVICE_GPS'),
        trust_meter_rating: dbUserSettings.trust_meter_rating
      });
    }
  }, [dbUserSettings]);

  // function preview image upload
  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  // set the preview image if dbUserSettings changes
  useEffect(() => {
    if (dbUserSettings?.image) {
      setPreviewImage(dbUserSettings.image);
    }
  }, [dbUserSettings]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]; // only take the first file
    if (selectedFile) {
      setFile(selectedFile);

      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewImage(objectUrl);
      logger.info('Image selected for upload:', { selectedFile });

      setIsSaveEnabled(true);
    }
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    > | { name: string; value: string }) => {
    // handle such scenarios where the event might not have the typical e.target structure i.e., PhoneInput.
    const name = 'target' in e ? e.target.name : e.name;
    const value = 'target' in e ? e.target.value : e.value;

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));

    // enable or disable save button based on form inputs
    const isFormFilled = Object.values(formData).some(v => v !== '');
    setIsSaveEnabled(isFormFilled);
  };

  // Function to save data to the database
  const handleSave = async () => { 
    // check if user is authenticated and form is valid
    if (!currentUser) {
      logger.warn('Form submission failed: User not authenticated.');
      return toast.error(t('SHARED.VALIDATION.SUBMISSION_FAILED_USER_NOT_AUTHENTICATED'));
    }

    const formDataToSend = new FormData();
    formDataToSend.append('user_name', formData.user_name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone_number', formData.phone_number);
    formDataToSend.append('findme', formData.findme);

    // add the image if it exists
    if (file) {
      formDataToSend.append('image', file);
    } else {
      formDataToSend.append('image', '');  // set to previous image url if no upload
    }

    logger.info('User Settings form data:', Object.fromEntries(formDataToSend.entries()));

    try {
      const data = await createUserSettings(formDataToSend);
      if (data.settings) {
        setDbUserSettings(data.settings);
        setIsSaveEnabled(false);        
        logger.info('User Settings saved successfully:', { data });
        toast.success(t('SIDE_NAVIGATION.VALIDATION.SUCCESSFUL_PREFERENCES_SUBMISSION'));
      }
    } catch (error) {
      logger.error('Error saving user settings:', { error });
      toast.error(t('SIDE_NAVIGATION.VALIDATION.UNSUCCESSFUL_PREFERENCES_SUBMISSION'));
    }
  }

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
      value: 'auto',
      name: t('Auto'),
    },
    {
      value: 'searchCenter',
      name: t('SIDE_NAVIGATION.FIND_ME_OPTIONS.PREFERRED_SEARCH_CENTER'),
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
                  fontSize: '18px' 
                }}
                onClick={() => {
                  router.push(`/map-center?entryType=search`);
                  props.setToggleDis(false); // Close sidebar on click
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
              style={{
                textAlign: 'center'
              }}
              value={formData.user_name? formData.user_name: ''}
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
              value={formData.email? formData.email: ""}
              onChange={handleChange}
            />
            <TelephoneInput
              label={t('SIDE_NAVIGATION.PHONE_NUMBER_FIELD')}
              value={formData.phone_number}
              name="phone_number"
              onChange={(value: any) => handleChange({ name: 'phone_number', value })}
              style={{
                textAlign: 'center'
              }}
            />

            <Button
              label={t('SHARED.SAVE')}
              disabled={!isSaveEnabled}
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
              <TrustMeter ratings={dbUserSettings ? dbUserSettings.trust_meter_rating : 100} hideLabel={true} />
            </div>             
            <Link href={currentUser ? `/seller/reviews/${currentUser?.pi_uid}` : '#'}>
              <OutlineBtn
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
                header={t('SIDE_NAVIGATION.PERSONALIZATION_SUBHEADER')}>
                <div className="mb-2">
                  <FileInput
                    label={t('SHARED.PHOTO.MISC_LABELS.USER_PREFERENCES_LABEL')}
                    imageUrl={ previewImage }
                    handleAddImage={handleAddImage}
                  />
                </div>

                <Select
                  label={t('SIDE_NAVIGATION.FIND_ME_PREFERENCE_LABEL')}
                  name="findme"
                  value={ formData.findme }
                  onChange={handleChange}
                  options={translateFindMeOptions}
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
                <Button
                  label={t('SHARED.SAVE')}
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
              </ToggleCollapse>              
            </div>
            <div className='flex flex-col justify-items-center mx-auto text-center'>
              <ToggleCollapse header={t('SIDE_NAVIGATION.ABOUT.ABOUT_MAP_OF_PI')}>
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
      {/* Conditionally render MapCenter */}
      {showMapCenter && (
        <MapCenter
          entryType="search"
        />
      )}
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
