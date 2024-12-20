"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Gender } from "@/types";

const GENDERS = [
  { value: Gender.Male, label: "Homme" },
  { value: Gender.Female, label: "Femme" },
  { value: Gender.NonBinary, label: "Non binaire" },
  { value: Gender.Other, label: "Autre" },
  { value: Gender.Undisclosed, label: "Non déclaré" },
] as const;

interface FancyMultiSelectProps {
  value?: Gender[];
  onChange?: (value: Gender[]) => void;
}

export function FancyMultiSelect({ value = [], onChange }: FancyMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const commandRef = React.useRef<HTMLDivElement>(null);

  const handleUnselect = React.useCallback(
    (gender: Gender) => {
      onChange?.(value.filter((s) => s !== gender));
    },
    [onChange, value]
  );

  const handleSelect = React.useCallback(
    (selectedValue: string) => {
      const genderValue = parseInt(selectedValue, 10) as Gender;
      if (!value.includes(genderValue)) {
        onChange?.([...value, genderValue]);
        setInputValue("");
      }
    },
    [onChange, value]
  );

  const handleBlur = React.useCallback((event: React.FocusEvent) => {
    const commandElement = commandRef.current;
    if (!commandElement?.contains(event.relatedTarget as Node)) {
      setOpen(false);
    }
  }, []);

  const selectableGenders = React.useMemo(
    () => GENDERS.filter((gender) => !value.includes(gender.value)),
    [value]
  );

  const hasSelectableGenders = selectableGenders.length > 0;

  return (
    <Command
      ref={commandRef}
      className="overflow-visible bg-transparent space-y-2"
      onBlur={handleBlur}
    >
      <div className="flex flex-col space-y-4">
        {/* Champ de recherche */}
        {hasSelectableGenders && (
          <div className="border rounded-md px-3 py-2 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            <CommandInput
              value={inputValue}
              onValueChange={setInputValue}
              placeholder="Rechercher..."
              className="bg-transparent outline-none placeholder:text-muted-foreground"
              onFocus={() => setOpen(true)}
            />
          </div>
        )}

        {/* Badges des genres sélectionnés */}
        {value.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {value.map((gender) => {
              const genderInfo = GENDERS.find((g) => g.value === gender);
              return (
                <button
                  key={gender}
                  onClick={() => handleUnselect(gender)}
                  className="focus:outline-none group"
                >
                  <Badge
                    variant="outline"
                    className="px-4 py-2 text-base font-medium cursor-pointer hover:bg-violet-200 hover:border-violet-500 transition-colors flex items-center gap-2"
                  >
                    {genderInfo?.label}
                    <X className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Badge>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Liste déroulante des options */}
      <div className="relative">
        {open && hasSelectableGenders && (
          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandList>
              <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
              <CommandGroup>
                {selectableGenders.map((gender) => (
                  <CommandItem
                    key={gender.value}
                    value={gender.value.toString()}
                    onSelect={handleSelect}
                    className="cursor-pointer"
                  >
                    {gender.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </div>
        )}
      </div>
    </Command>
  );
}
