import { Container, Wrapper } from './styles';

interface TextAreaProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

export function TextArea({
  label,
  placeholder,
  value,
  onChange,
  rows = 4,
}: TextAreaProps) {
  return (
    <Wrapper>
      {label && <label>{label}</label>}
      <Container
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    </Wrapper>
  );
}
