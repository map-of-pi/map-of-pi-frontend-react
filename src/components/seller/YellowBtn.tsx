'use client';

export default function YellowBtn(props){
    return(
      <>
      <div>
        <button className='btn bg-yellow-500 p-2 w-full text-left rounded-[5px] mb-2'>{props.text}<i className='arrow-right'></i></button>
      </div>
      </>
    )
  }