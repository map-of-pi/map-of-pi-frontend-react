'use client';

import { useContext } from "react";
import { AppContext } from "../../context/AppContextProvider";


export const login = ()=> {
    const { loginUser, autoLoginUser } = useContext(AppContext);
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("not logged in; wait for login...")
      loginUser();
    } else {
      autoLoginUser();
      console.log("logged in")
    }
}
