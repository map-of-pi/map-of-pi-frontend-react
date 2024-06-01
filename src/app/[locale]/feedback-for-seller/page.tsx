"use client";

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import EmojiPicker from '@/components/shared/Review/emojipicker';
import { FileInput, TextArea } from '@/components/shared/Forms/Inputs/Inputs';
import ConfirmDialog from '@/components/shared/confirm';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ReplyToReviewPage() {
    const t = useTranslations();
    const router = useRouter();

    const [files, setFiles] = useState<File[]>([]);
    const [previewImage, setPreviewImage] = useState<string[]>([]);
    const [comments, setComments] = useState('');
    const [reviewEmoji, setReviewEmoji] = useState(null);
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');

    useEffect(() => {
        if (files.length === 0) return;

        const objectUrls = files.map(file => URL.createObjectURL(file));
        setPreviewImage(objectUrls);

        return () => {
            objectUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [files]);

    useEffect(() => {
        const noReview = comments === "" && reviewEmoji === null && files.length === 0;
        setIsSaveEnabled(!noReview);
    }, [comments, reviewEmoji, files]);

    const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            setFiles(Array.from(selectedFiles));
        }
    };

    const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComments(e.target.value);
    };

    // Function to set emoji button value (null or 0 to 4 )
    const handleEmojiSelect = (emoji: any) => {
        setReviewEmoji(emoji);
    };

    // Function to collect reviews value and submit to DB
    const handleSave = () => {
        // Function to save data to the database
        // Example: saveData({ files, comments, reviewEmoji });

        setIsSaveEnabled(false);
    };

    // Function to trigger notification dialogue
    const handleNavigation = (route: string) => {
        if (isSaveEnabled) {
            setLinkUrl(route);
            setShowConfirmDialog(true);
        } else {
            router.push(`/${route}`);
        }
    };

    return (
        <div className="bg-[#FFFFFF] w-full md:w-[500px] md:mx-auto p-4">
            <h1 className='mb-5 font-bold text-2xl'>Reply to Review</h1>

            <div className="mb-4">
                <p className="mb-2">I am happy to let you all know that consumer to seller relationship is good.</p>
                <p className="text-sm text-gray-600">23 Oct. 2023 01:00pm</p>
                <p className="text-sm text-gray-600">By peejenn</p>
                <div className="flex items-center mt-2">
                    <span className="mr-2">😊</span>
                    <Image alt='review image' src="/images/shared/upload.png" width={50} height={50} className='rounded' />
                </div>
            </div>

            <div className='mb-3'>
                <h2 className="font-bold mb-2">Leave your reply to the above review</h2>
                <p>Select the face which shows how you feel about the above review</p>
                <EmojiPicker onSelect={handleEmojiSelect} />
            </div>

            <div className='mb-2'>
                <TextArea
                    placeholder={'Enter additional comments here...'}
                    value={comments}
                    onChange={handleCommentsChange}
                />
            </div>

            <div className='mb-2'>
                <FileInput
                    label={'Optional feedback photo upload'}
                    handleAddImages={handleAddImages}
                    images={previewImage}
                />
            </div>

            <div className='mb-7'>
                <button
                    onClick={handleSave}
                    disabled={!isSaveEnabled}
                    className={`${isSaveEnabled ? "opacity-100" : "opacity-50"} px-6 py-2 bg-[#386F4F] text-white text-xl rounded-md flex justify-right ms-auto text-[15px]`}
                >
                    Save
                </button>
            </div>

            <ConfirmDialog
                show={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                onConfirm={setShowConfirmDialog}
                message="You have unsaved changes. Do you really want to leave?"
                url={linkUrl}
            />
        </div>
    );
}
