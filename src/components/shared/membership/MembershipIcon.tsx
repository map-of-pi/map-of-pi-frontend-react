import Image from 'next/image'
import React from 'react'
import WhiteIcon from "../../../../public/images/membership/Member_icon_white.svg"
import GreenIcon from "../../../../public/images/membership/Member_icon_green.svg"
import GoldIcon from "../../../../public/images/membership/Member_icon_gold.svg"
import DoubleGoldIcon from "../../../../public/images/membership/Member_icon_double_gold.svg"
import TripleGoldIcon from "../../../../public/images/membership/Member_icon_triple_gold.svg"

function MembershipIcon({ category, className, styleComponent }: { category: string, className?: string, styleComponent?: any }) {
  const HandleMembership = (category: string) => {
    switch (category) {
      case "triple_gold":
        return TripleGoldIcon
      case "double_gold":
        return DoubleGoldIcon
      case "gold":
        return GoldIcon
      case "green":
        return GreenIcon
      case "white":
        return WhiteIcon
      default:
        return null
    }
  }

  const icon = HandleMembership(category);

  if (!icon) return null; // Don't render anything for casual members

  return (
    <div className={`w-7 h-5 relative float-right ${className || ''}`} style={styleComponent}>
      <Image src={icon} alt={category} fill style={{ objectFit: 'contain' }}/>
    </div>
  )
}

export default MembershipIcon