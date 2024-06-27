export const SkeletonSidebar = () => {
  return (
    <>
    <div className="skeleton">
      <div className="w-[70%] h-7 mb-5"></div>

      <div className="w-[52%] h-5 mb-2"></div>
      <div className="w-full h-10 mb-3 rounded-md"></div>

      <div className="w-[52%] h-5 mb-2"></div>
      <div className="w-full h-10 mb-4 rounded-md"></div>

      <div className="w-full h-10 mb-2 rounded-md"></div>
      <div className="w-full h-10 mb-2 rounded-md"></div>

      <div className="w-[40%] h-5 mb-2"></div>
      <div className="w-full h-[180px] flex flex-col justify-end py-3 items-center mb-2 rounded-md">
        <div
          className="w-[60%] h-3 mb-3"
          style={{ backgroundColor: 'var(--default-bg-color)' }}></div>
        <div
          className="w-[50%] h-3 mb-3"
          style={{ backgroundColor: 'var(--default-bg-color)' }}></div>
      </div>
    </div>
    </>
  );
};
