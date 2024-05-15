
export interface LangMenuItem {
    code: string;
    label: string;
    name: string;
    translation: string;
    imageUrl: string;
  }

export const Languages: LangMenuItem[] = [
    {
      code: 'en',
      label: 'EN',
      name: 'English',
      translation: 'English',
      imageUrl: '/images/shared/language/en.svg',
    },
    {
      code: 'es',
      label: 'ES',
      name: 'Spanish',
      translation: 'Español',
      imageUrl: '/images/shared/language/es.svg',
    },
    {
      code: 'ko',
      label: 'KO',
      name: 'Korean',
      translation: '한국어',
      imageUrl: '/images/shared/language/ko.svg',
    },
    {
      code: 'ng_hau',
      label: 'NG/HAU',
      name: 'Nigerian Hausa',
      translation: 'Hausa',
      imageUrl: '/images/shared/language/ng.svg',
    },
    {
      code: 'ng_ibo',
      label: 'NG/IBO',
      name: 'Nigerian Igbo',
      translation: 'Igbo',
      imageUrl: '/images/shared/language/ng.svg',
    },
    {
      code: 'ng_yor',
      label: 'NG/YOR',
      name: 'Nigerian Yoruba',
      translation: 'Yorùbá',
      imageUrl: '/images/shared/language/ng.svg',
    },
  ];