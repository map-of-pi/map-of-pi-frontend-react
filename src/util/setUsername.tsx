import { fetchUser } from "@/services/api";
import { useState } from "react";


export const setUsername = async (id: string) => {
    const [username, setUsername] = useState('');

    let user = await fetchUser(id);
    setUsername(user.username);
    console.log('username set successfully')
    return username
}