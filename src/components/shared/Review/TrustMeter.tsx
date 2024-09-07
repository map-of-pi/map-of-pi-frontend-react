import React from 'react';

type TrustMeterProps = {
  ratings: number;
};

const TrustMeter: React.FC<TrustMeterProps> = ({ ratings }) => {
  const percentageRating = ratings.toString();
  const average = 50; // this can be adjusted
  const condition = ratings < average

  const lines = Array.from({ length: 11 }, (_, i) => i); // Generates an array [0, 1, 2, ..., 7]

  return (
    <div className='w-full flex'>
      <h3 className='font-bold text-sm text-nowrap pe-2'>Trust-o-meter</h3>
      <div className='flex-1'>

        <div className="flex w-full">          
          <div className={`${condition ? 'bg-red-700' : 'bg-green-700'} rounded-full p-3 w-[5px] h-[5px]`}></div>
          
          {/* Primary indicator */}
          <div className={`rounded-e-[9px] h-[10px] w-full my-auto -ms-1 ${condition ? 'bg-red-400' : 'bg-green-400'}`}>
            
            {/* Secondary indicator */}
            <div
              className={`${condition ? 'bg-red-700' : 'bg-green-700'} h-[10px] rounded-e-[9px]`}
              style={{ width: `${percentageRating}%` }}
            ></div>
          </div>
        </div>
        <div className="mb-3 w-full ps-[25px]">
          <div className="flex justify-between px-1 overflow-hidden">
            {lines.map((_, index) => (
              <div key={index} className='bg-black rounded-t rounded-b' style={{ width: '2px', height: '10px' }}></div>
            ))}
          </div>
          <div className="flex justify-between">
            <span className='w-[9.09%] text-[14px]'>0<span className=' text-[12px]'>%</span></span>
            <span className='w-[9.09%] text-[14px]'></span>
            <span className='w-[9.09%] text-[14px]'></span>
            <span className='w-[9.09%] text-[14px]'></span>
            <span className='w-[9.09%] text-[14px]'></span>
            <span className='w-[9.09%] text-[14px]'>50<span className=' text-[12px]'>%</span></span>
            <span className='w-[9.09%] text-[14px]'></span>
            <span className='w-[9.09%] text-[14px]'></span>
            <span className='w-[9.09%] text-[14px]'>80<span className=' text-[12px]'>%</span></span>
            <span className='w-[9.09%] text-[14px]'></span>
            <span className='w-[9.09%] text-[14px]'>100<span className=' text-[12px]'>%</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustMeter;
