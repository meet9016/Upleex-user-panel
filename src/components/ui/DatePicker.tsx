"use client";

import React, { useState, useEffect, useRef } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  min?: string;
  max?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  align?: "left" | "right";
  textSize?: string;
  bookedRanges?: { start: string; end: string }[];
  disableBookedEndDates?: boolean;
}

export function DatePicker({
  value,
  onChange,
  min,
  max,
  label = "Select Date",
  className,
  disabled = false,
  align = "left",
  textSize = "text-sm",
  bookedRanges = [],
  disableBookedEndDates = true,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date()); // For navigation
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize current view based on value or today
  useEffect(() => {
    if (value) {
      setCurrentDate(new Date(value));
    } else {
      setCurrentDate(new Date());
    }
  }, [isOpen, value]); // Reset when opening

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "Select Date";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Select Date";
    
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    // Adjust for timezone offset to ensure YYYY-MM-DD matches local date
    const offset = selectedDate.getTimezoneOffset();
    const localDate = new Date(selectedDate.getTime() - offset * 60 * 1000);
    const dateStr = localDate.toISOString().split("T")[0];
    
    onChange(dateStr);
    setIsOpen(false);
  };

  const isDateBookedEndDate = (day: number) => {
    const dateToCheck = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    dateToCheck.setHours(0, 0, 0, 0);

    for (const range of bookedRanges) {
      const end = new Date(range.end);
      end.setHours(0, 0, 0, 0);

      if (dateToCheck.getTime() === end.getTime()) {
        return true;
      }
    }
    return false;
  };

  const isDateInBookedRanges = (day: number) => {
    const dateToCheck = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    dateToCheck.setHours(0, 0, 0, 0);

    for (const range of bookedRanges) {
      const start = new Date(range.start);
      start.setHours(0, 0, 0, 0);
      const end = new Date(range.end);
      end.setHours(0, 0, 0, 0);

      // Disable dates from start to end-1 (end date is return date, so it becomes available)
      if (dateToCheck >= start && dateToCheck < end) {
        return true;
      }
    }
    return false;
  };

  const isDateDisabled = (day: number) => {
    const dateToCheck = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    dateToCheck.setHours(0, 0, 0, 0);

    // Check min date
    if (min) {
      const minDate = new Date(min);
      minDate.setHours(0, 0, 0, 0);
      if (dateToCheck < minDate) return true;
    }

    // Check max date - only allow exact max date
    if (max) {
      const maxDate = new Date(max);
      maxDate.setHours(0, 0, 0, 0);
      if (dateToCheck.getTime() !== maxDate.getTime()) return true;
    }

    // Disable dates within booked ranges (start to end-1)
    if (isDateInBookedRanges(day)) return true;

    // Disable end dates (return dates) — shown with red border but not selectable
    if (disableBookedEndDates && isDateBookedEndDate(day)) return true;

    return false;
  };

  const isDateSelected = (day: number) => {
    if (!value) return false;
    const selected = new Date(value);
    return (
      selected.getDate() === day &&
      selected.getMonth() === currentDate.getMonth() &&
      selected.getFullYear() === currentDate.getFullYear()
    );
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const disabled = isDateDisabled(day);
      const selected = isDateSelected(day);
      const isBookedEnd = disableBookedEndDates && isDateBookedEndDate(day);
      const isInRange = isDateInBookedRanges(day);

      days.push(
        <button
          key={day}
          onClick={(e) => {
            e.stopPropagation();
            !disabled && handleDateClick(day);
          }}
          disabled={disabled}
          className={clsx(
            "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-all border-2",
            selected
              ? "bg-blue-600 text-white shadow-md border-blue-600"
              : isBookedEnd
              ? "text-red-400 cursor-not-allowed border-red-300 bg-red-50"
              : isInRange
              ? "text-gray-300 cursor-not-allowed border-transparent line-through"
              : disabled
              ? "text-gray-300 cursor-not-allowed border-transparent"
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-transparent"
          )}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div
      ref={containerRef}
      className={`relative ${className || ""}`}
    >
      {/* Trigger */}
      <div 
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen);
        }}
        className={clsx(
          "flex items-center justify-between w-full h-12 pl-4 pr-4 border rounded-lg shadow-sm bg-white transition-colors",
          disabled ? "bg-gray-50 opacity-80 cursor-not-allowed border-gray-200" : "cursor-pointer hover:border-blue-400",
          isOpen && !disabled ? "border-blue-500 ring-1 ring-blue-200" : ""
        )}
      >
        <div className="flex flex-col justify-center">
          <span className="text-[10px] text-gray-500 font-bold  leading-tight">
            {label}
          </span>
          <span className={clsx("font-bold text-gray-900 leading-tight", textSize)}>
            {value ? formatDateDisplay(value) : "Select Date"}
          </span>
        </div>
        <CalendarIcon
          className={clsx(
            "transition-colors",
            isOpen ? "text-blue-600" : "text-blue-600 group-hover:text-blue-700"
          )}
          size={20}
        />
      </div>

      {/* Dropdown Calendar */}
      {isOpen && (
        <div className={clsx(
          "absolute top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-40 animate-in fade-in zoom-in-95 duration-200",
          align === "right" ? "right-0" : "left-0"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-bold text-gray-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                className="h-8 flex items-center justify-center text-xs font-semibold text-gray-400"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-y-1 justify-items-center">
            {renderCalendarDays()}
          </div>
        </div>
      )}
    </div>
  );
}
