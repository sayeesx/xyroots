"use client";

import React, { useState, useRef, useEffect } from "react";

export interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  icon?: React.ReactNode;
  searchable?: boolean;
}

export default function CustomSelect({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select...", 
  icon, 
  searchable = false 
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);
  const filteredOptions = options.filter((opt) => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full text-left" ref={dropdownRef}>
      {/* Icon placed absolutely */}
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xyroots-teal z-10 pointer-events-none">
          {icon}
        </span>
      )}
      
      {/* Select Box Placeholder/Value */}
      <div 
        className={`w-full ${icon ? 'pl-9' : 'pl-3'} pr-8 py-2.5 text-sm bg-xyroots-surface border border-xyroots-border text-xyroots-text rounded-md cursor-pointer flex items-center justify-between hover:border-xyroots-teal transition-colors`}
        onClick={() => {
          setIsOpen(!isOpen);
          setSearchTerm("");
        }}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xyroots-muted pointer-events-none text-xs">▼</span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-xyroots-border dashboard-shadow rounded-md z-50 max-h-64 flex flex-col overflow-hidden">
          {searchable && (
            <div className="p-2 border-b border-xyroots-border sticky top-0 bg-white">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xyroots-muted">
                  <i className="bi bi-search text-xs" />
                </span>
                <input 
                  type="text" 
                  className="w-full pl-8 pr-2 py-1.5 text-xs border border-xyroots-border rounded outline-none focus:border-xyroots-teal transition-colors"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
            </div>
          )}
          
          <div className="overflow-y-auto custom-scrollbar flex-1 py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div 
                  key={opt.value} 
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-xyroots-mint hover:text-xyroots-teal transition-colors ${
                    value === opt.value ? 'bg-xyroots-mint text-xyroots-teal font-medium' : 'text-xyroots-text'
                  }`}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div className="px-3 py-4 text-xs text-center text-xyroots-muted">No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
