import { 
    MdStar,
    MdLocationPin,
} from 'react-icons/md';
import StorefrontIcon from '@mui/icons-material/Storefront';
import Link from 'next/link';
import Image from 'next/image';


export default function page(){
    return (
        <>
        <div className="p-5 bg-[#FFFFFF] w-full md:w-[500px] mx-auto ">
            <div>
                <div className="flex mb-3">
                    <h3 className='text-green-700 font-bold' >[TEST] DANNY & DIOR PARIS 30 MONTAIGNE</h3>
                    <div className="flex ms-2">
                        <p>0</p><MdStar></MdStar><MdStar></MdStar><MdStar></MdStar><MdStar></MdStar>
                    </div>
                    
                </div>
                <p className='mb-3'>
                    <StorefrontIcon />
                    <span>General</span>
                </p>
                <div className='flex mb-3'>
                    <MdLocationPin />
                    <span className='ms-2'>8th arrondissment Paris. France</span>
                </div>

                {/* <Image className='mb-3' /> */}
                <div className='flex outline rounded-[8px] mb-3'>
                    <button className='btn bg-green-800 p-1 w-full rounded-e-[15px] text-[#FFFFFF]'>XX Stamps</button>
                    <button className='btn bg-[#FFFFFF] p-1 w-full rounded-[15px] text-[#000000] -ms-6'>Menu</button>
                </div>
                <p className='text-center bg-yellow-400 text-dark font-bold p-4 my-4 rounded-[5px]'>
                    You can order online or pay in person
                </p>
                <div className='mb-6 shadow-[0_2px_18px_-6px_rgba(0,0,0,0.2)] p-1'>
                    <div className='mb-2 flex'>
                        <h4>Easter Egg</h4>
                        <p className='ms-auto'> <span className='font-bold'>5</span> Test@</p>
                    </div>
                    <div>
                        {/* <Image /> */}
                        <p className='text-grey-300'>Expensive Easter Egg!</p>
                    </div>
                    <button className='btn bg-red-500 px-3 py-1 ms-auto rounded-[5px] text-[#FFFFFF] flex justify-right'>Buy Now</button>
                </div>
                <div className='mb-6'>
                    <div className='mb-2 flex'>
                        <h4>Easter Egg</h4>
                        <figcaption className='ms-auto'> <span className='font-bold'>100</span> Test@</figcaption>
                    </div>
                    <div>
                        {/* <Image /> */}
                        <p className='text-grey-300'>Super Expensive Easter Egg!</p>
                    </div>
                    <button className='btn bg-red-500 px-3 py-1 ms-auto rounded-[5px] text-[#FFFFFF] flex justify-right'>Buy Now</button>
                </div>
            </div>
        </div>
        
        </>

    );
}