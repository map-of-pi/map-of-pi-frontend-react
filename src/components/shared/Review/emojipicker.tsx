"use client";

import { useTranslations } from 'next-intl';

import { useState } from 'react';

interface Emoji {
  name: string;
  unicode: string;
  code: string;
  value: number;
}

export default function EmojiPicker(props: any) {
  const t = useTranslations();

  const despairEmoji: Emoji = { name: t('SHARED.REACTION_RATING.EMOTIONS.DESPAIR'), unicode: "😠", code: ":despair:", value: 0 };
  const emojis: Emoji[] = [
    { name: t('SHARED.REACTION_RATING.EMOTIONS.SAD'), unicode: "🙁", code: ":sad_face:", value: 2 },
    { name: t('SHARED.REACTION_RATING.EMOTIONS.OKAY'), unicode: "🙂", code: ":okay_face:", value: 3 },
    { name: t('SHARED.REACTION_RATING.EMOTIONS.HAPPY'), unicode: "😃", code: ":happy_face:", value: 4 },
    { name: t('SHARED.REACTION_RATING.EMOTIONS.DELIGHT'), unicode: "😍", code: ":delight_face:", value: 5 }
  ];

  const [selectedEmoji, setSelectedEmoji] = useState<number | null>(null);

  // Function to handle the click of an emoji
  const handleEmojiClick = (emojiValue: number) => {
    if (selectedEmoji === emojiValue) {
      setSelectedEmoji(null);
      props.onSelect(null) // return null when no emoji is sellected
    } else {
      setSelectedEmoji(emojiValue);
      props.onSelect(emojiValue);  // return selected emoji value
    }
  };

  const getReview = (reviews: { [key: string]: number } | undefined, emojiName: string): number | undefined => {
    if (reviews) {
      return reviews[emojiName];
    }
    return undefined;
  };
  const emojiBtnClass = 'rounded-md w-full outline outline-[0.5px] flex justify-center items-center cursor-pointer p-1'

  return (
    <div>
      <div className='flex sm:overflow-hidden overflow-auto gap-3 w-full text-center justify-center my-2'>
        <div className='bg-[#DF2C2C33] flex-grow-[0.5] rounded-md p-2'>
          <p className='text-red-700 mb-2'>{t('SHARED.REACTION_RATING.UNSAFE')}</p>
          <div
            onClick={() => !props.clickDisabled ? handleEmojiClick(despairEmoji.value) : undefined}
            className={`${selectedEmoji !== despairEmoji.value ? 'bg-red-200' : 'bg-red-700'} outline-[#DF2C2C] ${emojiBtnClass}`}
          >
            <div>
              <p className='text-3xl md:py-2 py-1'>{despairEmoji.unicode}</p>
              <p className='md:text-[16px] text-[14px]'>{despairEmoji.name}</p>
              {props.reviews && (
                <p>{getReview(props.reviews, despairEmoji.name)}</p>
              )}
            </div>
          </div>
        </div>
        <div className='bg-[#3D924A8A] rounded-[10px] flex-grow-[4.3] flex-4 p-2 text-center text-white'>
          <p className='mb-2'>{t('SHARED.REACTION_RATING.TRUSTWORTHY')}</p>
          <div id='emoji-picker' className='flex gap-3 justify-center'>
            {emojis.map((emoji, index) => (
              <li
                key={index}
                onClick={() => !props.clickDisabled ? handleEmojiClick(emoji.value) : undefined}
                className={`${selectedEmoji !== emoji.value ? 'bg-transparent' : 'bg-primary'} outline-[#090C49] ${emojiBtnClass}`}
              >
                <div>
                  <p className='text-3xl md:py-2 py-1'>{emoji.unicode}</p>
                  <p className='md:text-[16px] text-[14px]'>{emoji.name}</p>
                  {props.reviews && (
                    <p>{getReview(props.reviews, emoji.name)}</p>
                  )}                                 
                </div>
              </li>
            ))}
          </div>
        </div>
      </div>
    </div>
  );  
}
