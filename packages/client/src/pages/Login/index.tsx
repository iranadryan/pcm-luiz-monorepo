import { useState } from 'react';
import { Title } from '../../components/Title';
import { Input } from '../../components/Input';
import { Container } from './styles';
import Logo from '../../assets/images/logo.svg';
import { Button } from '../../components/Button';
import { SignIn } from 'phosphor-react';
import { trpcClient } from '../../lib/trpcClient';
import { toast } from '../../utils/toast';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../components/Loader';

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuthContext();
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      setIsLoading(true);
      const result = await trpcClient.auth.authenticate.mutate({
        username,
        password,
      });

      sessionStorage.setItem('user', JSON.stringify(result.user));

      setUser(result.user);
      setIsLoading(false);
      navigate('/');
    } catch (error: any) {
      setIsLoading(false);
      toast({
        type: 'danger',
        text: error.message,
      });
    }
  }

  return (
    <Container>
      <Loader isLoading={isLoading} />
      <header>
        <img src={Logo} alt="PCM PORTAL" />
        <Title title="ENTRE EM SUA CONTA" />
        <p>Entre com seu usuário e senha para utilizar o sistema.</p>
      </header>

      <div className="form">
        <Input
          label="Usuário"
          placeholder="Nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          uppercase
        />
        <Input
          label="Senha"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          wrapperStyle={{ marginTop: 16 }}
          password
        />
        <Button style={{ marginTop: 24 }} onClick={handleLogin}>
          Entrar
          <SignIn size={20} color="#FFFFFF" weight="bold" />
        </Button>
      </div>
    </Container>
  );
}
