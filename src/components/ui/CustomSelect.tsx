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
  allowOther?: boolean;
}

export default function CustomSelect({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select...", 
  icon, 
  searchable = false,
  allowOther = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherText, setOtherText] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const otherInputRef = useRef<HTMLInputElement>(null);

  // Determine if current value is a custom "other" entry
  const isOtherValue = value && value !== "" && !options.find(o => o.value === value);
  const displayValue = isOtherValue
    ? value
    : options.find((opt) => opt.value === value)?.label || "";

  // When the component mounts with an "other" value, pre-fill the input
  useEffect(() => {
    if (isOtherValue && value) {
      setOtherText(value);
      setShowOtherInput(true);
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // If other input is showing but empty, clear it
        if (showOtherInput && !otherText.trim()) {
          setShowOtherInput(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showOtherInput, otherText]);

  const filteredOptions = options.filter((opt) => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectOther = () => {
    setIsOpen(false);
    setShowOtherInput(true);
    setOtherText("");
    setTimeout(() => otherInputRef.current?.focus(), 50);
  };

  const handleOtherConfirm = () => {
    const trimmed = otherText.trim();
    if (trimmed) {
      onChange(trimmed);
    }
    setShowOtherInput(false);
  };

  const handleOtherKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); handleOtherConfirm(); }
    if (e.key === "Escape") { setShowOtherInput(false); setOtherText(""); }
  };

  return (
    <div className="relative w-full text-left" ref={dropdownRef}>
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xyroots-teal z-10 pointer-events-none">
          {icon}
        </span>
      )}

      {showOtherInput ? (
        /* Custom "Other" text input */
        <div className="flex items-center gap-1.5">
          <input
            ref={otherInputRef}
            type="text"
            value={otherText}
            onChange={e => setOtherText(e.target.value)}
            onKeyDown={handleOtherKeyDown}
            onBlur={handleOtherConfirm}
            placeholder="Type your answer..."
            className="flex-1 px-3 py-2.5 text-sm bg-xyroots-surface border border-xyroots-teal rounded-md outline-none focus:ring-1 focus:ring-xyroots-teal"
          />
          <button
            type="button"
            onMouseDown={e => { e.preventDefault(); handleOtherConfirm(); }}
            className="px-2.5 py-2.5 text-xs font-bold bg-xyroots-teal text-white rounded-md hover:opacity-90 shrink-0"
          >
            OK
          </button>
        </div>
      ) : (
        <>
          {/* Select trigger */}
          <div
            className={`w-full ${icon ? 'pl-9' : 'pl-3'} pr-8 py-2.5 text-sm bg-xyroots-surface border border-xyroots-border text-xyroots-text rounded-md cursor-pointer flex items-center justify-between hover:border-xyroots-teal transition-colors`}
            onClick={() => {
              setIsOpen(!isOpen);
              setSearchTerm("");
            }}
          >
            <span className={`truncate ${!displayValue ? "text-gray-400" : ""}`}>
              {displayValue || placeholder}
            </span>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xyroots-muted pointer-events-none text-xs">▼</span>
          </div>

          {/* Dropdown */}
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

                {/* Other option */}
                {allowOther && (
                  <>
                    <div className="mx-2 my-1 border-t border-gray-100" />
                    <div
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-xyroots-mint hover:text-xyroots-teal transition-colors text-xyroots-muted italic flex items-center gap-1.5"
                      onClick={handleSelectOther}
                    >
                      <span className="text-xs font-bold not-italic bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">+</span>
                      Other (type your own)
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
