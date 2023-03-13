import { StyledInput, Wrapper } from './styles';

interface TimeInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function TimeInput({
  label,
  placeholder,
  value,
  onChange
}: TimeInputProps) {
  return (
    <Wrapper>
      {label && <label>{label}</label>}
      <StyledInput
        placeholder={placeholder}
        mask="99:99"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Wrapper>
  );
}
