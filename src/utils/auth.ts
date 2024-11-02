import { OnIncompletePaymentFoundType } from '@/constants/pi';
import { IUser } from '@/constants/types';
import logger from '../../logger.config.mjs';

export const checkAndAutoLoginUser = (currentUser:IUser | null, autoLoginUser:()=>void) => {
  if(!currentUser) {
    logger.info("User not logged in, attempting to auto-login..");
    autoLoginUser();
  } 
}

export const onIncompletePaymentFound : OnIncompletePaymentFoundType = payment => {
  logger.info('onIncompletePaymentFound:', { payment });
}
