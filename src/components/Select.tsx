import { useState, useEffect, useRef } from "react";
import { ArrowDown } from "@/icons/ArrowDown";

interface SelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export default function Select({ options, value, onChange }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} onClick={() => setIsOpen(true)} className="w-[240px] p-1 border border-gray-500 rounded relative">
      <p>{value}</p>

      <div className="absolute right-1 top-1/2 -translate-y-1/2">
        <ArrowDown w={16} h={16} />
      </div>

      {isOpen && (
        <div className="bg-white absolute top-[110%] left-0 w-full border border-gray-200 rounded">
          {options.map((option) => (
            <div key={option} className="p-1 hover:bg-gray-200" onClick={(e) => handleOptionClick(option, e)}>
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
