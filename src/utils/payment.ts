import logger from '../../logger.config.mjs';



// Callbacks the developer needs to implement:
const paymentCallbacks = {
  onReadyForServerApproval: function(paymentId:string) { 
    console.log("payment id: ", paymentId)
   },
  onReadyForServerCompletion: function(paymentId:string, txid:string) { 
    console.log("transaction id: ", txid)
   },
  onCancel: function(paymentId:string) { 
    console.log("payment cancelled: ", paymentId)
   },
  onError: function(error:any, payment:any) { 
    console.log("payment error: ", error)
   }
};


const createPayment = async (pi_uid: string) => {
  const paymentData = {
    amount: 1,
    memo: 'This is a Test Payment',
    metadata: { order_id: 1234 },
    uid: pi_uid
  };
  logger.info('Initializing Pi SDK for user registration.');
  await Pi.init({ version: '2.0', sandbox: process.env.NODE_ENV === 'development' });
  let isInitiated = Pi.initialized;

  if (isInitiated){
    try {
      const paymentId = await window.Pi.createPayment(paymentData);
      if (paymentId){
        console.log('payment details: ', paymentId)
      }
    }catch(error:any){
      console.log("error occured during payment", error)
    }
    
  }

}

export default createPayment