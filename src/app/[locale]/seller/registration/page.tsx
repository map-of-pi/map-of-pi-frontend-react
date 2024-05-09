import InputField from '@/components/seller/InputField';
import YellowBtn from '@/components/seller/YellowBtn';

function Page() {

  return (
    <>
    <div className="flex items-center justify-center p-5 mt-[56px]">
      <form action="" className="w-full md:w-1/2  mx-auto">
        <InputField labelText="Business Name" inputId="busName" intText="Enter the name of your business" />
        <InputField labelText="Business Description" inputId="busDesc" intText="Enter a simple description of your business" />
        <InputField labelText="Business Location" inputId="busLoc" intText="Enter the location of your business" />
        <div className="my-3">
          <label htmlFor="uploadFile1"
            className="text-gray-500 font-semibold text-base py-5 rounded max-w-md h-45 flex flex-col items-center justify-center cursor-pointer mx-auto font-[sans-serif]">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-11 mb-2 fill-gray-500" viewBox="0 0 32 32">
              <path
                d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                data-original="#000000" />
              <path
                d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                data-original="#000000" />
            </svg>
            Upload your business image

            <input type="file" id='uploadFile1' className="hidden" />
          </label>
        </div>
        <InputField labelText="Business Email Address" inputId="busEmail" type="mail" intText="Enter the email address of your business" />
        <YellowBtn text="Menu"/>
        <YellowBtn text="Loyalty Stamps"/>
        <YellowBtn text="Business Photos"/>
        <YellowBtn text="Get QR Code"/>
        <button className='btn bg-green-800 p-2 w-full my-4 rounded-[5px] text-white'>Confirm Business Settings</button>
      </form>
    </div>
    </>
  );
}

export default Page;