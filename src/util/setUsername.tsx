import { fetchUser } from "@/services/api";

export const setUsername = async (id: string) => {
    try {
        let user = await fetchUser(id);
    console.log('username set successfully', user)
    return user.username
    } catch (error){
        console.log(error)
    }
    
}