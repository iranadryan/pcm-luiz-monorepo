import { Container, Wrapper } from './styles';

interface TextAreaProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function TextArea({
  label,
  placeholder,
  value,
  onChange
}: TextAreaProps) {
  return (
    <Wrapper>
      {label && <label>{label}</label>}
      <Container
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
      />
    </Wrapper>
  );
}
