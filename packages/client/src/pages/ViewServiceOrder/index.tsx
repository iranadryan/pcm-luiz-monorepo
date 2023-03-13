import { ArrowLeft, Check } from 'phosphor-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Title } from '../../components/Title';
import { CloseOrderModal } from './components/CloseOrderModal';
import { Container } from './styles';

export function ViewServiceOrder() {
  const [closeOrderModalIsVisible, setCloseOrderModalIsVisible] =
    useState(false);

  return (
    <Container>
      <CloseOrderModal
        isVisible={closeOrderModalIsVisible}
        closeModal={() => setCloseOrderModalIsVisible(false)}
      />
      <header>
        <Link to="/" className="back-button">
          <ArrowLeft color="#FFFFFF" size={24} weight="bold" />
        </Link>
        <Title title="ORDEM ABERTA" />
      </header>
      <main>
        <div className="info">
          <div>
            <strong>Início</strong>
            <span>25/02/2023 - 10:00</span>
          </div>
          <div>
            <strong>Motorista</strong>
            <span>LUIZ FELIPE</span>
          </div>
          <div>
            <strong>Placa</strong>
            <span>ABC123</span>
          </div>
          <div>
            <strong>Kilometragem</strong>
            <span>123.987.456 KM</span>
          </div>
          <div className="stretch">
            <strong>Observação</strong>
            <span>
              A ROTA DO VEÍCULO PRECISOU SER REALOCADA DEVIDO A MANUTENÇÃO
            </span>
          </div>
        </div>
        <div className="activities-info">
          <h3>ATIVIDADES</h3>
          <div className="card">
            <h4>LUBRIFICAÇÃO ROLAMENTOS</h4>
            <div className="info">
              <div>
                <strong>Início</strong>
                <span>10:00</span>
              </div>
              <div>
                <strong>Final</strong>
                <span>25/02/2023 - 15:30</span>
              </div>
              <div>
                <strong>Placa</strong>
                <span>ABC123</span>
              </div>
              <div>
                <strong>Executante</strong>
                <span>MIGUEL PADILHA</span>
              </div>
              <div className="stretch">
                <strong>Materiais</strong>
                <span>1 UN - ÓLEO LUBRIFICANTE SKF</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Button onClick={() => setCloseOrderModalIsVisible(true)}>
        Fechar
        <Check size={20} color="#FFFFFF" weight="bold" />
      </Button>
    </Container>
  );
}
