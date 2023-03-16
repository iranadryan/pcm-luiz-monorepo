import { Container, Wrapper } from './styles';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: number | null | undefined;
  onChange: (value: number | null | undefined) => void;
}

export function InputNumber({
  label,
  value,
  onChange,
  placeholder,
}: InputProps) {
  return (
    <Wrapper>
      {label && <label>{label}</label>}
      <Container
        value={value}
        onValueChange={(e) => onChange(e.value)}
        placeholder={placeholder}
        minFractionDigits={0}
        maxFractionDigits={5}
        inputMode="decimal"
      />
    </Wrapper>
  );
}
