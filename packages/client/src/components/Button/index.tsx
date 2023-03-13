import { StyledButton } from './styles';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  secondary?: boolean
}

export function Button({ children, secondary = false, ...props }: ButtonProps) {
  return (
    <StyledButton secondary={secondary} {...props}>
      {children}
    </StyledButton>
  );
}
