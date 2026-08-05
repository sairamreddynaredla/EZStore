import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

const Select = ({ label, value, onValueChange, options, className = "", placeholder = "Select...", ...props }) => (
  <div className={`space-y-2 ${className}`}>
    {label ? <label className="text-sm font-medium text-slate-700">{label}</label> : null}
    <SelectPrimitive.Root value={value} onValueChange={onValueChange} {...props}>
      <SelectPrimitive.Trigger className="flex h-12 w-full items-center justify-between rounded-2xl border border-neutral-border bg-slate-50 px-4 text-left text-sm text-slate-900 outline-none transition hover:border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30">
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon className="text-slate-500">
          <ChevronDown size={18} />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content className="z-50 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <SelectPrimitive.Viewport className="max-h-72 overflow-y-auto px-1 py-2">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className="relative flex cursor-pointer select-none items-center justify-between rounded-2xl px-4 py-3 text-sm text-slate-700 outline-none transition hover:bg-slate-100 data-[state=checked]:bg-primary-600 data-[state=checked]:text-white"
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="text-slate-900">
                  <Check size={16} />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  </div>
);

export default Select;
