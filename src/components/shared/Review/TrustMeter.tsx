import React, {useEffect, useState} from 'react';
import Image from 'next/image';

type TrustMeterProps = {
  ratings: number;
  hideLabel?: boolean;
};

const TrustMeter: React.FC<TrustMeterProps> = ({ ratings, hideLabel}) => {
  const average = 50; // this can be adjusted
  const [ratingImage, setRatingImage] = useState<string>('')

  useEffect(() => {
    if (ratings===0){
      setRatingImage(`/review_ratings/trust-o-meter_0${ratings}0.PNG`);
    }if (ratings===50 || ratings===80) {
      setRatingImage(`/review_ratings/trust-o-meter_0${ratings}.PNG`);
    } else {
      setRatingImage(`/review_ratings/trust-o-meter_${ratings}.PNG`);
    }       
    }, [ratings]);

  return (
    <div className='w-full flex items-center mb-3'>
      <h3 className={`font-bold text-sm text-nowrap pe-2 ${hideLabel? 'hidden': 'block'}`}>Trust-o-meter</h3>
      <div className='flex-1'>

        <div className="flex w-full">          
          <Image 
          src={ratingImage} 
          alt='100% ratings' 
          width={400} 
          height={3}
          className="w-full max-w-xs md:max-w-md lg:max-w-lg"
          />          
        </div>
        
      </div>
    </div>
  );
};

export default TrustMeter;
