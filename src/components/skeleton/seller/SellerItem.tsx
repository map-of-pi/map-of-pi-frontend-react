export const SkeletonSellerItem = () => {
  return (
    <>
      <div className="w-full md:w-[500px] md:mx-auto p-4 skeleton">
        <div className="w-[40%] h-7 mb-4"></div>
        <div className="flex w-full my-bg-trans gap-4 mb-3">
          <div className="w-[65px] h-[65px] rounded-[50px]"></div>
          <div className="flex flex-grow flex-col justify-between my-2 gap-2 my-bg-trans">
            <div className="w-[20%] h-3"></div>
            <div className="w-[18%] h-3"></div>
          </div>
        </div>
        <div className="w-[35%] h-4 mb-3"></div>
        <div className="w-[60%] h-3 mb-3"></div>

        <div className="w-[38%] h-4 mb-3"></div>
        <div className="w-full h-10 mb-5 rounded-md"></div>

        <div className="w-[38%] h-4 mb-3"></div>
        <div className="w-[80%] h-3 mb-3"></div>
        <div className="w-[135px] h-10 rounded-md mb-2"></div>

        <div className="w-[30%] h-4 mb-3"></div>
        <div className="w-[80%] h-3 mb-3"></div>
        <div className="my-bg-trans flex gap-4 mb-3">
            <div className="h-[130px] flex-grow-[1] flex items-end rounded-md p-3">
            <div className="h-[88px] flex-1 rounded-md" style={{backgroundColor: 'var(--default-bg-color)'}}></div>
            </div>
            <div className="h-[130px] flex-grow-[4.1] rounded-md p-3 flex gap-2 items-end">
                <div className="h-[88px] flex-1 rounded-md" style={{backgroundColor: 'var(--default-bg-color)'}}></div>
                <div className="h-[88px] flex-1 rounded-md" style={{backgroundColor: 'var(--default-bg-color)'}}></div>
                <div className="h-[88px] flex-1 rounded-md" style={{backgroundColor: 'var(--default-bg-color)'}}></div>
                <div className="h-[88px] flex-1 rounded-md" style={{backgroundColor: 'var(--default-bg-color)'}}></div>
            </div>
        </div>

        <div className="w-full h-14 mb-5 rounded-md"></div>

        <div className="w-[45%] h-4 mb-3"></div>
        <div className="w-full h-[180px] flex flex-col justify-end py-3 items-center mb-2 rounded-md">
            <div className="w-[60%] h-3 mb-3" style={{backgroundColor: 'var(--default-bg-color)'}}></div>
            <div className="w-[50%] h-3 mb-3" style={{backgroundColor: 'var(--default-bg-color)'}}></div>
        </div>
        <div className="w-[145px] h-10 ml-auto rounded-md mb-2"></div>
      </div>
    </>
  );
};
