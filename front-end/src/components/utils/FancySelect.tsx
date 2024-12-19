"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { Gender } from "@/types";
import { useCallback } from "react";
import { useState } from "react";
import { useRef } from "react";

type Genders = Record<"value" | "label", string>;

const GENDERS = [
  {
    value: Gender.Male.toString(),
    label: "Homme",
  },
  {
    value: Gender.Female.toString(),
    label: "Femme",
  },
  {
    value: Gender.NonBinary.toString(),
    label: "Non binaire",
  },
  {
    value: Gender.Other.toString(),
    label: "Autre",
  },
  {
    value: Gender.Undisclosed.toString(),
    label: "Non déclaré",
  },
] satisfies Genders[];

// Add props interface
interface FancyMultiSelectProps {
  value?: Genders[];
  onChange?: (value: Genders[]) => void;
}

export function FancyMultiSelect({ value, onChange }: FancyMultiSelectProps = {}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Genders[]>(value || []);
  const [inputValue, setInputValue] = useState("");

  // Update parent when selection changes
  //   useEffect(() => {
  //     onChange?.(selected);
  //   }, [selected, onChange]);

  const handleUnselect = useCallback((Genders: Genders) => {
    setSelected((prev) => prev.filter((s) => s.value !== Genders.value));
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          setSelected((prev) => {
            const newSelected = [...prev];
            newSelected.pop();
            return newSelected;
          });
        }
      }
      // This is not a default behaviour of the <input /> field
      if (e.key === "Escape") {
        input.blur();
      }
    }
  }, []);

  const selectables = GENDERS.filter((g) => !selected.some((s) => s.value === g.value));

  //console.log(selectables, selected, inputValue);

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((Genders) => {
            return (
              <Badge key={Genders.value} variant="secondary">
                {Genders.label}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(Genders);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(Genders)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder=""
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && selectables.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((Genders) => {
                  return (
                    <CommandItem
                      key={Genders.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(value) => {
                        setInputValue("");
                        setSelected((prev) => [
                          ...prev,
                          {
                            value: Genders.value as string,
                            label: Genders.label,
                          },
                        ]);
                      }}
                      className={"cursor-pointer"}
                    >
                      {Genders.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}
