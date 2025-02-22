import React from 'react'
import DoubleGoldIcon from "../../../../public/images/membership/Member_icon_double_gold.svg"
import GoldIcon from "../../../../public/images/membership/Member_icon_gold.svg"
import GreenIcon from "../../../../public/images/membership/Member_icon_green.svg"
import TripleGoldIcon from "../../../../public/images/membership/Member_icon_triple_gold.svg"
import WhiteIcon from "../../../../public/images/membership/Member_icon_white.svg"
import Image from 'next/image'

function MembershipIcon({ category, className, styleComponent }: { category: string, className?: string, styleComponent?: any }) {
  const HandleMembership = (category: string) => {
    switch (category) {
      case "double_gold":
        return DoubleGoldIcon
      case "gold":
        return GoldIcon
      case "green":
        return GreenIcon
      case "triple_gold":
        return TripleGoldIcon
      default:
        return WhiteIcon
    }
  }

  return (
    <div className={`w-7 h-5 relative float-right ${className}`} style={styleComponent}>
        <Image src={HandleMembership(category)} fill alt={category} />
    </div>
  )
  
}

export default MembershipIcon