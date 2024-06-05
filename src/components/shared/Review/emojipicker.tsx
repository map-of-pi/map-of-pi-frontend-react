"use client";

import React, { useState } from 'react';

interface Emoji {
    name: string;
    unicode: string;
    code: string;
    value: number;
}


export default function EmojiPicker(props: any) {

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
            <div className='flex gap-3 w-full text-center justify-center my-2'>
                <div className='bg-[#DF2C2C33] rounded-md p-2'>
                    <p className='text-red-700 mb-2'>Unsafe</p>
                    <div
                        onClick={() => !props.clickDisabled ? handleEmojiClick(despairEmoji.value) : undefined}
                        className={`${selectedEmoji !== despairEmoji.value ? 'bg-red-200' : 'bg-red-700'} outline-[#DF2C2C] ${emojiBtnClass}`}
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
                <div className='bg-[#3D924A8A] rounded-[10px] w-full p-2 text-center text-white'>
                    <p className='mb-2'>Trust</p>
                    <div id='emoji-picker' className='flex gap-3 justify-center'>
                        {emojis.map((emoji, index) => (
                            <li
                                key={index}
                                onClick={() => !props.clickDisabled ? handleEmojiClick(emoji.value) : undefined}
                                className={`${selectedEmoji !== emoji.value ? 'bg-[#3D924A8A]' : 'bg-primary'} outline-[#090C49] ${emojiBtnClass}`}
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
