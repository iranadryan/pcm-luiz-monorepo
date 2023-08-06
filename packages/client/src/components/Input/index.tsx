import { Eye, EyeSlash } from 'phosphor-react';
import { Container, StyledInput, Wrapper } from './styles';
import { CSSProperties, useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  uppercase?: boolean;
  password?: boolean;
  wrapperStyle?: CSSProperties;
}

export function Input({
  label,
  value,
  uppercase,
  password,
  onChange,
  wrapperStyle,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Wrapper style={wrapperStyle}>
      {label && <label>{label}</label>}
      <Container>
        <StyledInput
          value={value}
          type={password && !showPassword ? 'password' : 'text'}
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
        {password && (
          <button onClick={() => setShowPassword((prevState) => !prevState)}>
            {showPassword ? (
              <EyeSlash color="#005125" size={16} weight="bold" />
            ) : (
              <Eye color="#005125" size={16} weight="bold" />
            )}
          </button>
        )}
      </Container>
    </Wrapper>
  );
}
