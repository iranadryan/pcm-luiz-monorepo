import { Container } from './styles';

import Logo from '../../assets/images/logo.svg';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SignOut } from 'phosphor-react';

export function Header() {
  const { signOut } = useAuthContext();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    navigate('/login');
  }

  return (
    <Container>
      <img src={Logo} alt="PCM PORTAL" />
      <div className="actions">
        {/* <button onClick={() => navigate('/user-config')}>
          <GearSix color="#005125" size={20} weight="fill" />
        </button> */}
        <button onClick={handleSignOut}>
          <SignOut color="#005125" size={20} weight="bold" />
        </button>
      </div>
    </Container>
  );
}
