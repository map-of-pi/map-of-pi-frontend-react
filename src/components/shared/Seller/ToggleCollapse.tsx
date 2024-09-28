import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';

function ToggleCollapse({
  children,
  header,
  defaultOpen = false,
}: {
  children: React.ReactNode;
  header: string;
  defaultOpen?: boolean;
}) {
  const [toggle, setToggle] = useState(defaultOpen);

  return (
    <div className="mb-2">
      <div
        className="flex items-center gap-4 cursor-pointer mb-2"
        onClick={() => setToggle(!toggle)}
      >
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

