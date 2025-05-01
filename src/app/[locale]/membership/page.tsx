"use client"

import React, {useContext} from "react";
import MembershipScreen from "../../../components/shared/Membership/membershipScreen";
import { AppContext } from "../../../../context/AppContextProvider";

const MembershipPage: React.FC = () => {
    const context = useContext(AppContext);
    return <MembershipScreen />;
}

export default MembershipPage;
