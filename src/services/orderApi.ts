// Import Axios client and logger
import axiosClient from "@/config/client";
import logger from '../../logger.config.mjs';
import { PaymentDataType } from "@/constants/types";

// Create or Update an Order
export const createOrUpdateOrder = async (orderData: any) => {
  try {
    logger.info("Sending request to create or update order", { orderData });

    const response = await axiosClient.post("/orders", orderData);

    if (response.status === 201 || response.status === 200) {
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

// Fetch all order list associated with the seller
export const fetchOrderList = async (sellerId: string) => {
  try {
    logger.info(`Fetching seller order list associated with sellerID: ${sellerId}`);
    const response = await axiosClient.get(`/orders/seller-order`);
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

// Fetch all order items associated with the seller
export const fetchOrderById = async (orderId: string) => {
  try {
    logger.info(`Fetching seller order items associated with orderID: ${orderId}`);
    const response = await axiosClient.get(`/orders/${orderId}`);
    if (response.status === 200) {
      logger.info(`Fetch seller order items successful with Status ${response.status}`, {
        data: response.data
      });
      return response.data;
    } else {
      logger.error(`Fetch seller order items failed with Status ${response.status}`);
      return null;
    }
  } catch (error) {
    logger.error('Fetch seller order items encountered an error:', error);
    throw new Error('Failed to fetch seller order items. Please try again later.');
  }
};

// Fetch all order items associated with the seller
export const updateOrderItemStatus = async (itemId:string, itemStatus:string) => {
  try {
    logger.info(`Update order item status with id: ${itemId}`);
    const response = await axiosClient.put(`/orders/${itemId}`, itemStatus);
    if (response.status === 200) {
      logger.info(`Update order item status successful with Status ${response.status}`, {
        data: response.data
      });
      return response.data;
    } else {
      logger.error(`Update order item status failed with Status ${response.status}`);
      return null;
    }
  } catch (error) {
    logger.error('Update order item status encountered an error:', error);
    throw new Error('Failed to update order item. Please try again later.');
  }
};