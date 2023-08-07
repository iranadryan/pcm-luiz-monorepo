import { Container } from './styles';

import Logo from '../../assets/images/logo.svg';
import { NavLink, useNavigate } from 'react-router-dom';
import { Clipboard, Gear, SignOut } from 'phosphor-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { takeTwoNames } from '../../utils/takeTwoNames';

export function Sidebar() {
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    navigate('/login');
  }

  return (
    <Container>
      <img src={Logo} alt="PCM PORTAL" />
      <nav>
        <ul className="wtree">
          <li>
            <span>
              <Clipboard size={24} weight="duotone" />
              ORDEM DE SERVIÇO
            </span>
          </li>
          <ul>
            <li>
              <NavLink to="/service-orders">Principal</NavLink>
            </li>
            {user?.role === 'ADMIN' && (
              <li>
                <NavLink to="/service-orders-dashboard">Dashboard</NavLink>
              </li>
            )}
          </ul>

          {user?.role === 'ADMIN' && (
            <>
              <li>
                <span>
                  <Gear size={24} weight="duotone" />
                  GERENCIAMENTO
                </span>
              </li>
              <ul>
                <li>
                  <NavLink to="/trucks">Placas</NavLink>
                </li>
                <li>
                  <NavLink to="/products">Produtos</NavLink>
                </li>
                <li>
                  <NavLink to="/people">Pessoas</NavLink>
                </li>
                <li>
                  <NavLink to="/services">Serviços</NavLink>
                </li>
                <li>
                  <NavLink to="/users">Usuários</NavLink>
                </li>
              </ul>
            </>
          )}
        </ul>
      </nav>
      <div className="user-section">
        <span>{takeTwoNames(user?.name || '')}</span>
        <div className="actions">
          {/* <button onClick={() => navigate('/user-config')}>
            <GearSix color="#005125" size={20} weight="fill" />
          </button> */}
          <button onClick={handleSignOut}>
            <SignOut color="#005125" size={20} weight="bold" />
          </button>
        </div>
      </div>
    </Container>
  );
}
