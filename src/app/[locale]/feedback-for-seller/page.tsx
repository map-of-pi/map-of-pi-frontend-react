"use client";

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

import EmojiPicker from '@/components/shared/Review/emojipicker';
import { FileInput, TextArea } from '@/components/shared/Forms/Inputs/Inputs';
import ConfirmDialog from '@/components/shared/confirm';

export default function ReplyToReviewPage() {
    const t = useTranslations();
    const router = useRouter();

    // Synthetic review data
    const reviewData = {
        reviewText: "I am happy to let you all know that consumer to seller relationship is good.",
        reviewDate: "23 Oct. 2023 01:00pm",
        reviewer: "peejenn",
        emoji: "😊", // This could be the actual emoji or an image URL if you have emoji images
        emojiText: "Happy", // Text representing the emoji
        reviewImage: "/images/shared/upload.png" // This is the path to the review image if any
    };

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

    const handleEmojiSelect = (emoji: any) => {
        setReviewEmoji(emoji);
    };

    const handleSave = () => {
        setIsSaveEnabled(false);
    };

    const handleNavigation = (route: string) => {
        if (isSaveEnabled) {
            setLinkUrl(route);
            setShowConfirmDialog(true);
        } else {
            router.push(`/${route}`);
        }
    };

    const translateReactionRating = (reaction: string): string => {
      switch (reaction) {
        case 'Despair':
          return t('SHARED.REACTION_RATING.EMOTIONS.DESPAIR');
        case 'Sad':
          return t('SHARED.REACTION_RATING.EMOTIONS.SAD');
        case 'Okay':
          return t('SHARED.REACTION_RATING.EMOTIONS.OKAY');
        case 'Happy':
          return t('SHARED.REACTION_RATING.EMOTIONS.HAPPY');
        case 'Delight':
          return t('SHARED.REACTION_RATING.EMOTIONS.DELIGHT');
        default:
          return reaction;
      }
    };

    return (
        <div className="bg-[#FFFFFF] w-full md:w-[500px] md:mx-auto p-4">
            <h1 className='mb-5 font-bold text-2xl'>{t('SCREEN.REPLY_TO_REVIEW.REPLY_TO_REVIEW_HEADER')}</h1>

            <div className="mb-4">
                <p className="mb-2">{reviewData.reviewText}</p>
                <p className="text-sm text-gray-600">{reviewData.reviewDate}</p>
                <p className="text-sm text-gray-600">{t('SCREEN.REPLY_TO_REVIEW.BY_REVIEWER', {buyer_id: reviewData.reviewer})}</p>
                <div className="flex items-center mt-2">
                    <span className="mr-2">{reviewData.emoji}</span>
                    <span>{translateReactionRating(reviewData.emojiText)}</span>
                    <Image alt='review image' src={reviewData.reviewImage} width={50} height={50} className='rounded ml-2' />
                </div>
            </div>

            <div className='mb-3'>
                <h2 className="font-bold mb-2">{t('SCREEN.REPLY_TO_REVIEW.REPLY_TO_REVIEW_MESSAGE')}</h2>
                <p>{t('SCREEN.REPLY_TO_REVIEW.FACE_SELECTION_REVIEW_MESSAGE')}</p>
                <EmojiPicker onSelect={handleEmojiSelect} />
            </div>

            <div className='mb-2'>
                <TextArea
                    placeholder={t('SCREEN.REPLY_TO_REVIEW.ADDITIONAL_COMMENTS_PLACEHOLDER')}
                    value={comments}
                    onChange={handleCommentsChange}
                />
            </div>

            <div className='mb-2'>
                <FileInput
                    label={t('SCREEN.REPLY_TO_REVIEW.FEEDBACK_PHOTO_UPLOAD_LABEL')}
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
                    {t('SHARED.SAVE')}
                </button>
            </div>

            <ConfirmDialog
                show={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                onConfirm={setShowConfirmDialog}
                message={t('SHARED.CONFIRM_DIALOG')}
                url={linkUrl}
            />
        </div>
    );
}
