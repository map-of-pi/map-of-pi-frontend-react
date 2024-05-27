import React from 'react';

type TrustMeterProps = {
  ratings: number;
};

const verticalLines = () => {
  return <div style={{ width: '6%', height: '15px', borderInline: 'solid 1px black' }}></div>;
};

const TrustMeter: React.FC<TrustMeterProps> = ({ ratings }) => {
  const maxRating = 5.0; // this can be adjusted
  const percentageRating = (ratings / maxRating * 100).toString();
  const average = 2.0; // this can be adjusted
  const condition = ratings < average

  const lines = Array.from({ length: 9 }, (_, i) => i); // Generates an array [0, 1, 2, ..., 7]

  return (
    <div className='w-full flex'>
      <h3 className='font-bold text-sm text-nowrap pe-3'>Trust-O-meter</h3>
      <div className='w-full'>

        <div className="flex w-full">          
          {/* ball */}
          <div className={`${condition ? 'bg-red-700' : 'bg-green-700'} rounded-full p-3 w-[5px] h-[5px]`}></div>
          
          {/* Primary indicator */}
          <div className={`rounded-e-[9px] h-[10px] w-full my-auto -ms-1 ${condition ? 'bg-red-200' : 'bg-green-200'}`}>
            
            {/* Secondary indicator */}
            <div
              className={`${condition ? 'bg-red-700' : 'bg-green-700'} h-[10px] rounded-e-[9px]`}
              style={{ width: `${percentageRating}%` }}
            ></div>
          </div>
        </div>
        <div className="mb-3 w-full ps-[30px]">
          <div className="flex gap-[6%] overflow-hidden">
            {lines.map((_, index) => (
              <div key={index} style={{ width: '6%', height: '15px', borderInline: 'solid 1px black' }}></div>
            ))}
          </div>
          <div className="w-full flex justify-between">
            <span>0%</span>
            <span className="ps-[30%]">50%</span>
            <span className="ps-[12%]">80%</span>
            <span className="ps-[8%] md:ms-[11%]">100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustMeter;
