import Image from 'next/image';
import Link from 'next/link';

const MapPopupCard = () => {
  return (
    <>
      <div className="max-w-sm rounded-md overflow-hidden">
        <Image
          className="w-full"
          width={200}
          height={200}
          src="https://tse3.mm.bing.net/th?id=OIP.Ijh2DJJVlAmhBAYABFwI-wAAAA&pid=Api&P=0&h=220"
          alt="Shop Image"
        />
        <div className="flex items-center justify-between my-2">
          <div className="font-bold text-md ">Shop name</div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center">
            <svg
              className="h-6 w-6 flex-none fill-gray-100 stroke-green-500 stroke-2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <circle cx="12" cy="12" r="11" />
              <path
                d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9"
                fill="none"
              />
            </svg>
            <div className="ml-1">
              <code className="text-sm font-bold text-gray-900">XXX km</code> 34
              km
            </div>
          </div>
          <div className="flex items-center">
            <svg
              className="h-6 w-6 flex-none fill-gray-100 stroke-green-500 stroke-2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <circle cx="12" cy="12" r="11" />
              <path
                d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9"
                fill="none"
              />
            </svg>
            <div className="ml-1">accept online payment</div>
          </div>
          <div className="flex items-center">
            <svg
              className="h-6 w-6 flex-none fill-gray-100 stroke-green-500 stroke-2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <circle cx="12" cy="12" r="11" />
              <path
                d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9"
                fill="none"
              />
            </svg>
            <div className="ml-1">34 products</div>
          </div>
        </div>

        <div className="flex items-center mt-3 justify-center gap-3">
          <Link href={'/seller/seller-item'}>
            <div
              className="bg-red-800 w-[100px]   text-center rounded-md text-white py-1 mt-1"
              id="${shop._id}">
              visit shop
            </div>
          </Link>
          <div
            className="bg-blue-800 w-[100px]   text-center rounded-md text-white py-1 mt-1"
            id="comming">
            take routes
          </div>
        </div>
      </div>
    </>
  );
};

export default MapPopupCard;
