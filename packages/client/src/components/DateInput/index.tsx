import { StyledInput, Wrapper } from './styles';

interface DateInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  secondary?: boolean;
}

export function DateInput({
  label,
  placeholder,
  value,
  onChange,
  secondary = false
}: DateInputProps) {
  return (
    <Wrapper>
      {label && <label>{label}</label>}
      <StyledInput
        secondary={secondary}
        mask="99/99/9999"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maskChar={null}
      />
    </Wrapper>
  );
}
