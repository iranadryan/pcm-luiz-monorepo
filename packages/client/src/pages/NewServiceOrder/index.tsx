import moment from 'moment';
import { ArrowLeft, ArrowRight } from 'phosphor-react';
import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Option } from '../../components/Select';
import { Title } from '../../components/Title';
import { trpc } from '../../lib/trpc';
import { ActivitiesStep } from './components/ActivitiesStep';
import { CreatedModal } from './components/CreatedModal';
import { HeaderStep } from './components/HeaderStep';
import { Container } from './styles';

export interface Material {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

export interface Activity {
  id: string;
  activityId: string;
  name: string;
  startTime: string;
  endTime: string;
  endDate: string;
  performer: string | null;
  materials: Material[];
}

export interface FormData {
  startDate: string;
  startTime: string;
  plate: string | null;
  driver: string | null;
  kilometers: string;
  observation: string;
  activities: Activity[];
}

export function NewServiceOrder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [concludedModalIsVisible, setConcludedIsVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    startDate: moment().format('DDMMYYYY'),
    startTime: moment().format('HHmm'),
    plate: null,
    driver: null,
    kilometers: '',
    observation: '',
    activities: []
  });
  const FormTitles = ['NOVA ORDEM DE SERVIÇO', 'INSIRA AS ATIVIDADES'];
  const { data: trucks } = trpc.truck.list.useQuery();
  const { data: drivers } = trpc.person.list.useQuery('DRIVER');
  const { data: mechanics } = trpc.person.list.useQuery('MECHANIC');
  const { data: services } = trpc.service.list.useQuery();
  const { data: materials } = trpc.product.list.useQuery();

  const truckOptions: Option[] = useMemo<Option[]>(() => !trucks
    ? []
    : trucks.map((truck) => ({
      value: truck.id,
      label: `${truck.plate} - ${truck.name}`
    })), [trucks]);
  const driverOptions: Option[] = useMemo<Option[]>(() => !drivers
    ? []
    : drivers.map((driver) => ({
      value: driver.id,
      label: driver.name
    })), [drivers]);
  const mechanicOptions: Option[] = useMemo<Option[]>(() => !mechanics
    ? []
    : mechanics.map((mechanic) => ({
      value: mechanic.id,
      label: mechanic.name
    })), [mechanics]);
  const serviceOptions: Option[] = useMemo<Option[]>(() => !services
    ? []
    : services.map((service) => ({
      value: service.id,
      label: `${service.code} - ${service.name}`
    })), [services]);
  const materialOptions: Option[] = useMemo<Option[]>(() => !materials
    ? []
    : materials.map((material) => ({
      value: material.id,
      label: `${material.code} - ${material.name}`
    })), [materials]);
  const materialUnits = useMemo(() => !materials
    ? []
    : materials.map((material) => ({
      id: material.id,
      unit: 'UN'
    })), [materials]);

  const handleDataChange = useCallback((
    name: keyof FormData,
    data: string | number | Activity[],
  ) => {
    setFormData((prevData) => ({ ...prevData, [name]: data }));
  }, []);

  function handleSubmitForm() {
    console.log('Formulário enviado', formData);
    setConcludedIsVisible(true);
  }

  function handlePreviousStep() {
    setCurrentStep((prevStep) => prevStep === 0 ? prevStep : prevStep - 1);
  }

  function handleNextStep() {
    setCurrentStep(
      (prevStep) => prevStep === FormTitles.length - 1 ? prevStep : prevStep + 1
    );
  }

  function StepDisplay() {
    switch (currentStep) {
    case 0:
      return <HeaderStep
        plateOptions={truckOptions}
        driverOptions={driverOptions}
        data={formData}
        onDataChange={handleDataChange}
      />;
    case 1:
      return <ActivitiesStep
        activityOptions={serviceOptions}
        performerOptions={mechanicOptions}
        materialOptions={materialOptions}
        materialUnits={materialUnits}
        data={formData}
        onDataChange={handleDataChange}
      />;
    }
  }

  return (
    <Container>
      <CreatedModal isVisible={concludedModalIsVisible} />
      <header>
        {currentStep === 0 && (
          <Link to="/" className="back-button">
            <ArrowLeft color="#FFFFFF" size={24} weight="bold" />
          </Link>
        )}
        <Title title={FormTitles[currentStep]} />
      </header>
      <div className="form">
        {StepDisplay()}
      </div>
      <footer>
        {currentStep > 0 && (
          <Button onClick={handlePreviousStep}>
            <ArrowLeft color="#FFFFFF" size={20} weight="bold" />
            Anterior
          </Button>
        )}
        <Button onClick={
          currentStep === FormTitles.length - 1
            ? handleSubmitForm
            : handleNextStep
        }>
          {currentStep === FormTitles.length - 1 ? 'Finalizar' : 'Próximo'}
          <ArrowRight color="#FFFFFF" size={20} weight="bold" />
        </Button>
      </footer>
    </Container>
  );
}
