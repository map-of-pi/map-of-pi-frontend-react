import logger from '../../logger.config.mjs';
import { IUser } from '@/constants/types';

export const authentication = (currentUser:IUser | null, autoLoginUser:()=>void) => {
  if(!currentUser) {
    logger.info("User not logged in, attempting to auto-login..");
    autoLoginUser();
  } 
}