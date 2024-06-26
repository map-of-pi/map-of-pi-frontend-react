import '../skeleton.css';

export const SkeletonSellerReview = () => {
  return (
    <>
      <div className="px-4 py-[20px] skeleton sm:max-w-[520px] w-full m-auto">
        <div className="w-[70%] h-7 mb-5"></div>
        <div className="border-b border-[#D9D9D9].py-4 my-bg-trans">
          <div className="w-[90%] h-7 mb-3"></div>

          <div className="flex w-full my-bg-trans gap-3 mb-4">
            <div className="w-[20%] h-5"></div>
            <div className="w-[20%] h-5"></div>
          </div>
          <div className="w-[20%] h-5 mb-3"></div>

          <div className="flex w-full items-center my-bg-trans gap-3 mb-4">
            <div className="w-5 h-5 rounded-[50%]"></div>
            <div className="w-[12%] h-3"></div>
            <div className="w-[60px] h-[33px] rounded-sm"></div>
          </div>
        </div>
      </div>
    </>
  );
};
