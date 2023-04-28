import { Container } from './styles';

interface TableProps {
  children: React.ReactNode;
}

export function Table({ children }: TableProps) {
  return (
    <Container>
      <table>
        {children}
      </table>
    </Container>
  );
}
