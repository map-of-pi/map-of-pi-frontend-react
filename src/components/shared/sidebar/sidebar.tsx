import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useParams, usePathname, useRouter } from 'next/navigation';

import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import Link from 'next/link';
import { Button } from '@/components/shared/Forms/Buttons/Buttons';
import {
  FileInput,
  Input,
  TelephoneInput,
} from '@/components/shared/Forms/Inputs/Inputs';
import { menu } from '@/constants/menu';
import InfoModel from '@/components/shared/About/Info/Info';
import PrivacyPolicyModel from '@/components/shared/About/privacy-policy/PrivacyPolicy';
import TermsOfServiceModel from '@/components/shared/About/terms-of-service/TermsOfService';
import styles from './sidebar.module.css';

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
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const locale = 'en';

  const { resolvedTheme, setTheme } = useTheme();
  const [toggle, setToggle] = useState<any>({
    Themes: false,
    Languages: false,
  });

  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const handlePhoneNumberChange = (value: string | undefined) => {
    setPhoneNumber(value);
  };

  const [showInfoModel, setShowInfoModel] = useState(false);
  const [showPrivacyPolicyModel, setShowPrivacyPolicyModel] = useState(false);
  const [showTermsOfServiceModel, setShowTermsOfServiceModel] = useState(false);

  const handleAddImages = () => {};

  const handleChildMenu = (title: any, code: string) => {
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

  const handleMenu = (title: any, url: string) => {
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
  };

  return (
    <>
      <div className="w-full h-[calc(100vh-74px)] fixed bottom-0 bg-transparent right-0 z-[70]">
        <div
          className="absolute w-full h-full bg-[#82828284]"
          onClick={() => props.setToggleDis(false)}></div>
        <div
          className={`absolute bg-white right-0 top-0 z-50 p-[1.2rem] h-[calc(100vh-74px)] sm:w-[350px] w-[250px] overflow-y-auto`}>
          <div className="text-2xl font-bold mb-4 pb-5">User Preferences</div>
          <div className="">
            <Input
              label="Your Email Address"
              placeholder="mapofpi@mapofpi.com"
              type="email"
            />
            <TelephoneInput
              label="Your Phone Number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
            />
            <div className="pt-5 flex flex-col gap-5">
              <Button
                label="Set Search Center"
                styles={{
                  color: '#ffc153',
                  width: '100%',
                  height: '50px',
                  padding: '10px',
                }}
                onClick={() => {
                  router.push('/map-center')
                  props.setToggleDis(false) // Close sidebar on click
                }} 
              />
              <Link href="/seller/seller-reviews">
                <Button
                  label="Check Reviews"
                  styles={{
                    background: '#fff',
                    color: '#ffc153',
                    width: '100%',
                    height: '50px',
                    padding: '10px',
                    borderColor: 'var(--default-primary-color)',
                    borderWidth: '2px',
                  }}
                  onClick={() => props.setToggleDis(false)} // Close sidebar on click
                />
              </Link>
            </div>
            <div className="pt-5">
              <FileInput
                label="Upload Photo (Optional)"
                images={[]}
                handleAddImages={handleAddImages}
              />
            </div>
          </div>
          {/* <div
            className="ml-auto flex justify-end mb-8"
            onClick={() => props.setToggleDis(false)}>
            <Image
              src="/images/shared/sidebar/close.svg"
              alt="close button"
              width={22}
              height={22}
              className=" cursor-pointer"
            />
          </div> */}
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
                    <span className="ml-2">{menu.title}</span>
                    {menu.children && (
                      <div className="ml-4">
                        <FaChevronDown
                          size={13}
                          className="text-[#000000] hover:invert"
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
                          className={`${styles.slide_content} hover:bg-[#424242] hover:text-white `}
                          onClick={() =>
                            handleChildMenu(menu.title, child.code)
                          }>
                          {child.icon && ( // conditional rendering
                            <Image
                              src={child.icon}
                              alt={child.title}
                              width={17}
                              height={17}
                              className=""
                            />
                          )}
                          {menu.title === 'Languages' &&
                          isLanguageMenuItem(child) ? (
                            <div className="ml-2 text-[14px]">
                              <div className="font-bold">{child.label}</div>
                              <div>{child.translation}</div>
                            </div>
                          ) : (
                            <span className="ml-2 text-[14px]">
                              {child.title}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </>
            ))}
          </div>
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
