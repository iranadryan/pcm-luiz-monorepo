import { StyledButton } from './styles';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  secondary?: boolean;
  tertiary?: boolean;
  danger?: boolean;
}

export function Button({
  children,
  secondary = false,
  tertiary = false,
  danger = false,
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      secondary={secondary}
      tertiary={tertiary}
      danger={danger}
      {...props}
    >
      {children}
    </StyledButton>
  );
}
