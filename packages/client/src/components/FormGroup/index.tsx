import { Container } from './styles';

interface FormGroupProps {
  children: React.ReactNode;
  error?: string;
}

export function FormGroup({ children, error }: FormGroupProps) {
  return (
    <Container>
      {children}
      {error && (<small className="error-message">{error}</small>)}
    </Container>
  );
}
