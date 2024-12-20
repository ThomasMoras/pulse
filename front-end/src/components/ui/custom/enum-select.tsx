import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EnumSelectProps<T extends number> {
  value: T;
  onChange: (value: T) => void;
  options: ReadonlyArray<{ readonly value: T; readonly label: string }>;
  placeholder?: string;
}

export function EnumSelect<T extends number>({
  value,
  onChange,
  options,
  placeholder,
}: EnumSelectProps<T>) {
  return (
    <Select
      value={value.toString()}
      onValueChange={(v) => {
        // Ne pas traiter les valeurs vides
        if (!v) return;
        const numericValue = Number(v);
        // Vérifier que la valeur est valide
        if (options.some((opt) => opt.value === numericValue)) {
          onChange(numericValue as T);
        }
      }}
    >
      <SelectTrigger>
        <SelectValue>
          {options.find((opt) => opt.value === value)?.label || placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map(({ value: optionValue, label }) => (
          <SelectItem key={optionValue} value={optionValue.toString()}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
