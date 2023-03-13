import { Container, Wrapper } from './styles';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value: string;
}

export function Input({
  label,
  value,
  onChange,
  ...props
}: InputProps) {
  return (
    <Wrapper>
      {label && <label>{label}</label>}
      <Container
        value={value}
        onChange={onChange}
        {...props}
      />
    </Wrapper>
  );
}
