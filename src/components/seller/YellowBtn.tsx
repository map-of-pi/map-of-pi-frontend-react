'use client';
import { MdArrowForward } from 'react-icons/md';

export default function YellowBtn(props: any){
    return(
      <>
      <div>
        <button className='btn bg-yellow-500 p-2 w-full text-left rounded-[5px] mb-2 flex text-[#000000] dark:text-[#FFFFFF]'>
          {props.text}
          <MdArrowForward className="ms-auto my-auto" />
        </button>
      </div>
      </>
    )
  }