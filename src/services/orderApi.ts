import axiosClient from "@/config/client";
import logger from '../../logger.config.mjs';

// Create or Update an Order
export const createOrUpdateOrder = async (orderData: any) => {
  try {
    logger.info("Sending request to create or update order", { orderData });
    const response = await axiosClient.post("/orders", orderData);
    if (response.status === 201) {
      logger.info(`Order processed successfully with Status ${response.status}`, {
        data: response.data,
      });
      return response.data;
    } else {
      logger.error(`Order processing failed with Status ${response.status}`);
      return null;
    }
  } catch (error) {
    logger.error("Error processing order:", error);
    throw new Error("Failed to create or update order. Please try again later.");
  }
};

// Fetch all orders associated with the seller
export const fetchSellerOrders = async (sellerId: string) => {
  try {
    logger.info(`Fetching seller order list associated with sellerID: ${sellerId}`);
    const response = await axiosClient.get(`/orders/seller-orders`);
    if (response.status === 200) {
      logger.info(`Fetch seller orders successful with Status ${response.status}`, {
        data: response.data
      });
      return response.data;
    } else {
      logger.error(`Fetch seller orders failed with Status ${response.status}`);
      return null;
    }
  } catch (error) {
    logger.error('Fetch seller orders encountered an error:', error);
    throw new Error('Failed to fetch seller orders. Please try again later.');
  }
};

// Fetch all orders associated with the current buyer
export const fetchBuyerOrders = async (buyerId: string) => {
  try {
    logger.info(`Fetching buyer order list associated with userID: ${buyerId}`);
    const response = await axiosClient.get(`/orders/review/buyer-orders`);
    if (response.status === 200) {
      logger.info(`Fetch buyer orders successful with Status ${response.status}`, {
        data: response.data
      });
      return response.data;
    } else {
      logger.error(`Fetch buyer orders failed with Status ${response.status}`);
      return null;
    }
  } catch (error) {
    logger.error('Fetch buyer orders encountered an error:', error);
    throw new Error('Failed to fetch buyer orders. Please try again later.');
  }
};

// Fetch a single order associated with the seller
export const fetchOrderById = async (orderId: string) => {
  try {
    logger.info(`Fetching single seller order associated with orderID: ${orderId}`);
    const response = await axiosClient.get(`/orders/${orderId}`);
    if (response.status === 200) {
      logger.info(`Fetch single seller order successful with Status ${response.status}`, {
        data: response.data
      });
      return response.data;
    } else {
      logger.error(`Fetch single seller order failed with Status ${response.status}`);
      return null;
    }
  } catch (error) {
    logger.error('Fetch single seller order encountered an error:', error);
    throw new Error('Failed to fetch single seller order. Please try again later.');
  }
};

// Update the order status of an existing order
export const updateOrderStatus = async (orderId: string, orderStatus: string) => {
  try {
    logger.info(`Updating order status to ${orderStatus} with id: ${orderId}`);
    const response = await axiosClient.put(`/orders/update/${orderId}`, {orderStatus});
    if (response.status === 200) {
      logger.info(`Update order status successful with Status ${response.status}`, {
        data: response.data
      });
      return response.data;
    } else {
      logger.error(`Update order status to ${orderStatus} failed with Status ${response.status}`);
      return null;
    }
  }
  catch (error) {
    logger.error('Update order status encountered an error:', error);
    throw new Error('Failed to update order status. Please try again later.');
  }
}

// Update the order item status of an existing order item
export const updateOrderItemStatus = async (itemId: string, itemStatus: string) => {
  try {
    logger.info(`Update order item status to ${itemStatus} with id: ${itemId}`);
    const response = await axiosClient.put(`/orders/item/${itemId}`, {itemStatus});
    if (response.status === 200) {
      logger.info(`Update order item status successful with Status ${response.status}`, {
        data: response.data
      });
      return response.data;
    } else {
      logger.error(`Update order item status to ${itemStatus} failed with Status ${response.status}`);
      return null;
    }
  } catch (error) {
    logger.error('Update order item status encountered an error:', error);
    throw new Error('Failed to update order item. Please try again later.');
  }
};