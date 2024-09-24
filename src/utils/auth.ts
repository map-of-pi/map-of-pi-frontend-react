import { OnIncompletePaymentFoundType } from '@/constants/pi';

import logger from '../../logger.config.mjs';

export const onIncompletePaymentFound : OnIncompletePaymentFoundType = payment => {
  logger.info('onIncompletePaymentFound:', { payment });
}
