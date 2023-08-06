import { Container } from './styles';

import Logo from '../../assets/images/logo.svg';
import { NavLink } from 'react-router-dom';
import { Clipboard, Gear } from 'phosphor-react';
import { useAuthContext } from '../../contexts/AuthContext';

export function Sidebar() {
  const { user } = useAuthContext();

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
    </Container>
  );
}
