import React from 'react';

function SkeletonNotification() {
  return (
    <div className="skeleton">
      <div className="w-full border-2 border-solid border-[#bdbdbd] rounded-lg p-4 mb-3 my-bg-trans">
        <div className="w-[26%] h-[15px] mb-[4px] bg-[#bdbdbd]"></div>
        <div className="w-full h-[30px] mb-1 border border-[#BDBDBD] rounded border-solid bg-[#bdbdbd]"></div>
        <div className="w-[32%] h-[15px] mb-[2px] bg-[#bdbdbd]"></div>
        <div className="flex gap-2 w-full  my-bg-trans">
          <div className="flex-[4] h-[30px] border border-[#BDBDBD] rounded border-solid bg-[#bdbdbd]"></div>
          <div className="flex-1 h-[30px] bg-[#BDBDBD] rounded-md"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonNotification;
