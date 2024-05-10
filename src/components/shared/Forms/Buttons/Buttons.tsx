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
  return (
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      style={props.styles}>
      {props.label}
    </button>
  );
};
