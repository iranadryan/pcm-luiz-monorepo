import { Container } from './styles';

import Logo from '../../assets/images/logo.svg';

export function Header() {
  return (
    <Container>
      <img src={Logo} alt="PCM PORTAL" />
    </Container>
  );
}
