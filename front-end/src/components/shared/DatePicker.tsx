"use client";
import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DatePicker({
  value,
  onChange,
}: {
  value?: Date;
  onChange: (date: Date | undefined) => void;
}) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    value || new Date()
  );
  const [month, setMonth] = React.useState<Date>(value || new Date());

  React.useEffect(() => {
    if (value) {
      setInternalDate(value);
      setMonth(value);
    }
  }, [value]);

  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 81 }, (_, i) => currentYear - 80 + i)
      .filter((year) => year <= currentYear)
      .sort((a, b) => b - a); // Trier du plus récent au plus ancien
  }, []);

  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleYearSelect = (yearString: string) => {
    const year = parseInt(yearString);
    const newDate = new Date(month);
    newDate.setFullYear(year);
    setMonth(newDate);
  };

  const handleMonthSelect = (monthString: string) => {
    const monthIndex = months.indexOf(monthString);
    const newDate = new Date(month);
    newDate.setMonth(monthIndex);
    setMonth(newDate);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setInternalDate(selectedDate);
    onChange(selectedDate); // Notifie le parent
  };

  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[280px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {internalDate ? (
              formatDate(internalDate)
            ) : (
              <span>Sélectionnez une date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex space-x-2 p-2 bg-gray-100 border-b">
            <Select
              value={months[month.getMonth()]}
              onValueChange={handleMonthSelect}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Mois" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={month.getFullYear().toString()}
              onValueChange={handleYearSelect}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Année" />
              </SelectTrigger>
              <SelectContent className="h-[300px] overflow-y-auto">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Calendar
            mode="single"
            selected={internalDate}
            onSelect={handleDateSelect}
            month={month}
            onMonthChange={setMonth}
            initialFocus
            className="p-2"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DatePicker;
