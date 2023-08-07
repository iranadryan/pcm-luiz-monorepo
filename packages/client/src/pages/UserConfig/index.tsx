import { ArrowLeft } from 'phosphor-react';
import { Container } from './styles';
import { Title } from '../../components/Title';
import { useResponsiveContext } from '../../contexts/ResponsiveContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { takeTwoNames } from '../../utils/takeTwoNames';

export function UserConfig() {
  const { user } = useAuthContext();
  const { headerHeight } = useResponsiveContext();

  return (
    <Container headerHeight={headerHeight}>
      <header>
        <button className="back-button">
          <ArrowLeft color="#FFFFFF" size={24} weight="bold" />
        </button>
        <Title title={takeTwoNames(user?.name || '')} />
      </header>
      <main>
        <div className="menu">
          <button>Redefinir minha senha</button>
          <button>Sair da Conta</button>
        </div>
      </main>
    </Container>
  );
}
