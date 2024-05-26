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

  const lines = Array.from({ length: 8 }, (_, i) => i); // Generates an array [0, 1, 2, ..., 7]

  return (
    <div className="w-full">
      <div className="flex align-center mt-2">
        <div className={`${ratings < average ? 'bg-red-700' : 'bg-green-700'} rounded-full p-3 w-[5px] h-[5px]`}></div>
        <div className={`rounded-e-[9px] h-[10px] w-full my-auto -ms-1 ${ratings < average ? 'bg-red-200' : 'bg-green-200'}`}>
          <div
            className={`${ratings < average ? 'bg-red-700' : 'bg-green-700'} h-[10px] rounded-e-[9px]`}
            style={{ width: `${percentageRating}%` }}
          ></div>
        </div>
      </div>
      <div className="mb-3 w-full ms-[30px]">
        <div className="flex gap-[6%] overflow-hidden">
          {lines.map((_, index) => (
            <div key={index} style={{ width: '6%', height: '15px', borderInline: 'solid 1px black' }}></div>
          ))}
        </div>
        <div className="w-full flex justify-between">
          <span>0%</span>
          <span className="ms-[30%]">50%</span>
          <span className="ms-[12%]">80%</span>
          <span className="ms-[9%]">100%</span>
        </div>
      </div>
    </div>
  );
};

export default TrustMeter;
