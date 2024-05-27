"use client";

import React, { useState } from 'react';
import styles from './emojipicker.module.css';

interface Emoji {
    name: string;
    unicode: string;
    code: string;
    value: number;
}

interface EmojiPickerProps {
    clickDisabled?: boolean;
    reviews?: { [key: string]: number };
}

export default function EmojiPicker(props: EmojiPickerProps) {

    const despairEmoji: Emoji = { name: "Despair", unicode: "😠", code: ":despair:", value: 0 };
    const emojis: Emoji[] = [
        { name: "Sad", unicode: "🙁", code: ":sad_face:", value: 1 },
        { name: "Okay", unicode: "🙂", code: ":okay_face:", value: 2 },
        { name: "Happy", unicode: "😃", code: ":happy_face:", value: 3 },
        { name: "Delight", unicode: "😍", code: ":delight_face:", value: 4 }
    ];

    const [selectedEmoji, setSelectedEmoji] = useState<number | null>(null);

    // Function to handle the click of an emoji
    const handleEmojiClick = (emojiValue: number) => {
        if (selectedEmoji === emojiValue) {
            setSelectedEmoji(null);
        } else {
            setSelectedEmoji(emojiValue);
        }
    };

    const getReview = (reviews: { [key: string]: number } | undefined, emojiName: string): number | undefined => {
        if (reviews) {
            return reviews[emojiName];
        }
        return undefined;
    };

    return (
        <div>
            <div className='flex gap-3 w-full text-center my-2'>
                <div className='bg-red-200 rounded-[10px] w-[100px] md:w-[100px] p-2'>
                    <p className='text-red-700 mb-2'>Unsafe</p>
                    <div
                        onClick={() => !props.clickDisabled ? handleEmojiClick(despairEmoji.value) : undefined}
                        className={`${selectedEmoji !== despairEmoji.value ? 'bg-red-200' : 'bg-red-700'} w-full outline outline-red-300 rounded-[10px] flex justify-center items-center cursor-pointer p-1`}
                    >
                        <div>
                            <p className='text-3xl py-2'>{despairEmoji.unicode}</p>
                            <p>{despairEmoji.name}</p>
                            {props.reviews && (
                                <p>{getReview(props.reviews, despairEmoji.name)}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className='bg-[#8DBE95] rounded-[10px] w-full p-2 text-center text-white'>
                    <p className='mb-2'>Trust</p>
                    <div id='emoji-picker' className='flex gap-3'>
                        {emojis.map((emoji, index) => (
                            <li
                                key={index}
                                onClick={() => !props.clickDisabled ? handleEmojiClick(emoji.value) : undefined}
                                className={`${selectedEmoji !== emoji.value ? 'bg-[#8DBE95]' : 'bg-[#386F4F]'} w-full md:w-[75px] outline outline-green-700 rounded-[10px] flex justify-center items-center cursor-pointer p-1`}
                            >
                                <div>
                                    <p className='text-3xl py-2'>{emoji.unicode}</p>
                                    <p>{emoji.name}</p>
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
