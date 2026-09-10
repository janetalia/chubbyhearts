import { Input } from "@/components/ui/input";

interface FormFieldProps extends React.ComponentProps<typeof Input> {
  label: string;
  placeholder: string;
  required?: boolean;
}

export default function FormField({ label, placeholder, required, ...props }: FormFieldProps) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold leading-5 text-[#252525]">
        {label}
        {required && <span className="ml-1 text-[#d96f61]">*</span>}
      </span>
      <Input
        {...props}
        required={required}
        placeholder={placeholder}
        className="mt-2 h-[51px] rounded-[16px] border-[#e9e5de] bg-white px-4 text-sm text-[#252525] placeholder:text-[#bfbbb5] focus-visible:ring-[#ee9266]/30"
      />
    </label>
  );
}
