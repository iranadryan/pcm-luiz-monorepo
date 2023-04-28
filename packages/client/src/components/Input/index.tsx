import { Container, Wrapper } from './styles';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value: string;
  uppercase?: boolean;
}

export function Input({
  label,
  value,
  uppercase,
  onChange,
  ...props
}: InputProps) {
  return (
    <Wrapper>
      {label && <label>{label}</label>}
      <Container
        value={value}
        onChange={(e) => {
          if (uppercase) {
            e.target.value = e.target.value.toUpperCase();
          }

          if (onChange) {
            onChange(e);
          }
        }}
        {...props}
      />
    </Wrapper>
  );
}
