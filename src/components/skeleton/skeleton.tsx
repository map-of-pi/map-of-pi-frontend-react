import React from 'react';
import './skeleton.css';
import { SkeletonSellerRegistration } from './seller/Registration';
import { SkeletonSellerReview } from './seller/Review';
import { SkeletonSellerItem } from './seller/SellerItem';
import { SkeletonSidebar } from './Sidebar';
import { SkeletonNotification } from './Notification';

function Skeleton(props : any) {
  if (props.type === "seller_registration") return <SkeletonSellerRegistration />;
  if (props.type === "seller_review") {
    return Array(8).fill(null).map((_, index) => (
        <SkeletonSellerReview key={index} />
    ));
  }
  if (props.type === "seller_item") return <SkeletonSellerItem />;
  if (props.type === "sidebar") return <SkeletonSidebar />;
  if (props.type === "notification") {
    return Array(10).fill(null).map((_, index) => ( 
      <SkeletonNotification key={index} />
    ));
  }
}

export default Skeleton;