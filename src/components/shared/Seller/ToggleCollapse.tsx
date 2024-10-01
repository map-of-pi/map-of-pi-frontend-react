import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';

interface ToggleCollapseProps {
  children: React.ReactNode;
  header: string;
  open?: boolean;
}

function ToggleCollapse({ children, header, open = false }: ToggleCollapseProps) {
  const [toggle, setToggle] = useState<boolean>(open);

  return (
    <div className="mb-2">
      <div className="flex items-center gap-4 cursor-pointer mb-2" onClick={() => setToggle(!toggle)}>
        <h2 className="font-bold">{header}</h2>
        <FaChevronDown
          size={13}
          className={`text-[#000000] ${toggle && 'rotate-90'}`}
        />
      </div>
      {toggle && children}
    </div>
  );
}

export default ToggleCollapse;
