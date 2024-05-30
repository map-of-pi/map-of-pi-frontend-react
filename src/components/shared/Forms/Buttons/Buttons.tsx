import React from 'react';
import styles from './Buttons.module.css';
import { RiAddFill } from 'react-icons/ri';

export const AddButton = (props: any) => {
  return (
    <button className={styles.add_btn} onClick={props.handleAddBtn}>
      <RiAddFill fontWeight={900} size={30} />
    </button>
  );
};

export const Button = (props: any) => {
  const {styles, icon, label, disabled, onClick} = props;
  return (
    <button
      className={`px-4 py-1 ${disabled ? `bg-[grey]` : `bg-[#386F4F]`} text-white rounded-md flex gap-1 cursor-pointer items-center justify-center `}
      style={styles} disabled={disabled} onClick={onClick}>
      {icon && icon}
      {label && label}
    </button>
  );
};

export const YellowBtn = (props: any) => {
  return (
    <div>
      <button
        onClick={props.handleClick}
        className="btn bg-yellow-500 flex gap-1 cursor-pointer items-center font-bold text-[20px] p-2 w-full text-left rounded-[px] mb-2"
        style={props.styles}>
        {props.icon && props.icon}
        {props.text && props.text}
      </button>
    </div>
  );
};
