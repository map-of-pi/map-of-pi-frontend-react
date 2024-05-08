import React from 'react';
import styles from './Buttons.module.css';
import { IoAddOutline } from 'react-icons/io5';

export const AddButton = (props: any) => {
  return (
    <button className={styles.add_btn} onClick={props.handleAddBtn}>
      <IoAddOutline fontWeight={900} />
    </button>
  );
};

export const Button = (props: any) => {
  return (
    <button className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'>
      {props.label}
    </button>
  )
}