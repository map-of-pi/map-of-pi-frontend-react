import Image from 'next/image';

import { OutlineBtn } from '@/components/shared/Forms/Buttons/Buttons';

function SellerReviews() {
  interface ReviewInt {
    heading: string;
    date: string;
    time: string;
    user: string;
    reaction: string;
    unicode: string;
  }
  [];

  const ReviewsInfo = {
    heading:
      ' I am happy to let you all know that consumer to seller relationship is good.',
    date: '23 Oct. 2023',
    time: '01:00pm',
    user: 'By peejenn',
    reaction: 'Happy',
    unicode: '🙂',
  };

  const ReviewData: ReviewInt[] = [
    {
      heading:
        ' I am happy to let you all know that consumer to seller relationship is good.',
      date: '23 Oct. 2023',
      time: '01:00pm',
      user: 'By peejenn',
      reaction: 'Happy',
      unicode: '🙂',
    }
  ].concat(ReviewsInfo,ReviewsInfo,ReviewsInfo,ReviewsInfo,ReviewsInfo);

  return (
    <>
      <div className="px-4 py-[20px] text-[#333333] sm:max-w-[520px] w-full m-auto">
        <h1 className="text-[#333333] text-lg font-semibold dark:text-white md:font-bold md:text-2xl mb-1">
          List of Reviews left for Femma
        </h1>
        {ReviewData.map((item, index) => (
          <div key={index} className="border-b border-[#D9D9D9] py-4">
            <p className="text-lg mb-2">{item.heading}</p>
            <div className="flex gap-3 text-[#828282]">
              <p>{item.date}</p>
              <p>{item.time}</p>
            </div>
            <div className="text-primary mb-3">{item.user}</div>
            <div className="flex justify-between items-center">
              <div className="flex">
                <div className="mr-4">
                  <span>{item.unicode}</span>{' '}
                  <span className="text-sm">{item.reaction}</span>
                </div>
                <Image
                  src="/images/business/product.png"
                  alt="emoji image"
                  width={60}
                  height={60}
                />
              </div>
              <OutlineBtn label="Reply" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default SellerReviews;
