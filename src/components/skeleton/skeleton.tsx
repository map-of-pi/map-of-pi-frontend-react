import React from 'react';
import './skeleton.css';
import { SkeletonSellerReg } from './seller/Registration';
import { SkeletonSellerReview } from './seller/Review';
import { SkeletonSellerItem } from './seller/SellerItem';
import { SkeletonSidebar } from './Sidebar';


function Skeleton(props : any) {
    if (props.type === "seller_reg") return <SkeletonSellerReg />;
    if (props.type === "seller_review") return Array(8).fill(<SkeletonSellerReview />);
    if (props.type === "seller_item") return <SkeletonSellerItem />;
    if (props.type === "sidebar") return <SkeletonSidebar />;
}

export default Skeleton;
