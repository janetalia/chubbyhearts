import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormFieldProps extends React.ComponentProps<typeof Input> {
  label: string;
  placeholder?: string;
  required?: boolean;
}

export default function FormField({
  label,
  placeholder = "",
  required,
  className,
  type,
  ...props
}: FormFieldProps) {
  return (
    <label className={cn("block w-full min-w-0", className)}>
      <span className="text-[13px] font-semibold leading-5 text-[#252525]">
        {label}
        {required && <span className="ml-1 text-[#d96f61]">*</span>}
      </span>
      <Input
        type={type}
        required={required}
        placeholder={placeholder}
        className={cn(
          "mt-2 h-[51px] w-full min-w-0 max-w-full rounded-[16px] border-[#e9e5de] bg-white px-4 text-sm text-[#252525] placeholder:text-[#bfbbb5] focus-visible:ring-[#ee9266]/30",
          type === "date" && "block w-full min-w-0 max-w-full [color-scheme:light]"
        )}
        {...props}
      />
    </label>
  );
}
