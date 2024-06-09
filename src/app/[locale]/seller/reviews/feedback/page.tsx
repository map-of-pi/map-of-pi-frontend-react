"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import EmojiPicker from '@/components/shared/Review/emojipicker';
import { FileInput, TextArea } from '@/components/shared/Forms/Inputs/Inputs';
import ConfirmDialog from '@/components/shared/confirm';
import { fetcSinglehReview, createReview, updateReview, deleteReview } from '@/services/api';

export default function ReplyToReviewPage() {
    const router = useRouter();

    const [files, setFiles] = useState<File[]>([]);
    const [previewImage, setPreviewImage] = useState<string[]>([]);
    const [comments, setComments] = useState('');
    const [reviewEmoji, setReviewEmoji] = useState<any>(null);
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');

    const [reviewData, setReviewData] = useState({
        reviewId: '',
        reviewReceiver: '',
        comment: 'no review yet',
        reviewDate: '00/00/0000',
        reviewer: 'Reviewer name',
        emoji: 'no',
        emojiText: 'no',
        reviewImage: '/images/shared/upload.png'
    });

    useEffect(() => {
        const fetchReviewData = async () => {
            try {
                const data = await fetcSinglehReview('reviewId'); // replace 'sellerId' with actual seller ID
                setReviewData(data);
            } catch (error) {
                console.error('Error fetching review data:', error);
            }
        };
        fetchReviewData();
    }, []);

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

    const handleEmojiSelect = (emoji: any) => {
        setReviewEmoji(emoji);
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('comments', comments);
        formData.append('emoji', reviewEmoji);
        files.forEach(file => formData.append('images', file));

        try {
            await createReview(formData); // Or updateReview if editing an existing review
            setIsSaveEnabled(false);
        } catch (error) {
            console.error('Error saving review:', error);
        }
    };

    const handleNavigation = (route: string) => {
        if (isSaveEnabled) {
            setLinkUrl(route);
            setShowConfirmDialog(true);
        } else {
            router.push(`/${route}`);
        }
    };

    const HEADER = "mb-5 font-bold text-lg md:text-2xl";
    const SUBHEADER = "font-bold mb-2";

    return (
        <div className="w-full md:w-[500px] md:mx-auto p-4">
            <h1 className={HEADER}>Reply to Review of {reviewData.reviewReceiver}</h1>

            <div className="mb-4">
                <p className="mb-2">{reviewData.comment}</p>
                <p className="text-sm text-gray-400">{reviewData.reviewDate}</p>
                <p className="text-sm text-gray-600">By {reviewData.reviewer}</p>
                <div className="flex items-center mt-2">
                    <span className="mr-2">{reviewData.emoji}</span>
                    <span>{reviewData.emojiText}</span>
                    <Image alt='review image' src={reviewData.reviewImage} width={50} height={50} className='rounded ml-2' />
                </div>
            </div>

            <div className='mb-3'>
                <h2 className={SUBHEADER}>Leave your reply to the above review</h2>
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
                    label={'Feedback photo upload'}
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
