'use client';

import React, { useState } from 'react';

export default function InputField(props){
    return (
      <>
      <div className="pb-3 ">
        <label htmlFor={props.inputId} className='text-[#000000] dark:text-[#FFFFFF]'>{props.labelText}</label><br/>
        <input type={props.type? props.type: "text"} id={props.inputId} placeholder={props.intText} className="peer outline outline-1 rounded-[5px] p-1 w-full" />
      </div>
      </>
    )
  }