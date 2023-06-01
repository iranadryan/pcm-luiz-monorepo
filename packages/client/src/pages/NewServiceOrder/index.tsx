import moment from 'moment';
import { ArrowLeft, ArrowRight } from 'phosphor-react';
import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Option } from '../../components/Select';
import { Title } from '../../components/Title';
import { trpc } from '../../lib/trpc';
import { ServiceStep } from './components/ServiceStep';
import { CreatedModal } from './components/CreatedModal';
import { HeaderStep } from './components/HeaderStep';
import { Container } from './styles';
import { ServiceOrderFormData } from 'server/src/types';
import { serviceOrderSchema } from './utils/serviceOrderSchema';
import { Loader } from '../../components/Loader';
import useErrors from '../../hooks/useErrors';
import { toast } from '../../utils/toast';
import { useResponsiveContext } from '../../contexts/ResponsiveContext';

export interface Material {
  id: string;
  name: string;
  quantity: number | null | undefined;
  unit: string;
}

export interface Service {
  id: string;
  serviceId: string;
  name: string;
  startTime: string;
  endTime: string;
  endDate: string;
  executorId: string | null;
  description: string;
  isEnded: boolean;
  materials: Material[];
}

export interface FormData {
  startDate: string;
  startTime: string;
  truckId: string | null;
  driverId: string | null;
  odometer: number | null | undefined;
  observation: string;
  services: Service[];
}

export function NewServiceOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [concludedModalIsVisible, setConcludedIsVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    startDate: moment().format('DDMMYYYY'),
    startTime: moment().format('HHmm'),
    odometer: null,
    driverId: null,
    truckId: null,
    observation: '',
    services: [],
  });
  const FormTitles = ['NOVA ORDEM DE SERVIÇO', 'INSIRA AS ATIVIDADES'];
  const { data: trucks } = trpc.truck.list.useQuery();
  const { data: drivers } = trpc.person.list.useQuery('DRIVER');
  const { data: mechanics } = trpc.person.list.useQuery('MECHANIC');
  const { data: services } = trpc.service.list.useQuery();
  const { data: materials } = trpc.product.list.useQuery();
  const serviceOrderMutation = trpc.serviceOrder.create.useMutation();
  const { setAllErrors, getErrorMessageByFieldName } = useErrors();
  const { headerHeight } = useResponsiveContext();

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
    data: string | number | null | undefined | Service[],
  ) => {
    setFormData((prevData) => ({ ...prevData, [name]: data }));
  }, []);

  async function handleSubmitForm() {
    setIsLoading(true);
    const validatedFormData = serviceOrderSchema.safeParse(formData);

    if (!validatedFormData.success) {
      setIsLoading(false);
      toast({
        type: 'danger',
        text: 'Preencha todos os campos obrigatórios.',
        duration: 4000
      });
      const errors = validatedFormData.error.issues.map((error) => ({
        field: error.path.join('.'),
        message: error.message
      }));
      setAllErrors(errors);
      return;
    }

    const { data } = validatedFormData;
    const parsedFormData: ServiceOrderFormData = {
      startDate: moment(data.startDate, 'DDMMYYYY').toDate(),
      startTime: moment(data.startTime, 'HHmm').toDate(),
      truckId: data.truckId,
      driverId: data.driverId,
      odometer: data.odometer,
      observation: data.observation === '' ? undefined : data.observation,
      services: data.services.map((service) => ({
        serviceId: service.serviceId,
        executorId: service.executorId,
        startTime: moment(service.startTime, 'HHmm').toDate(),
        endDate: service.endDate ? moment(service.endDate, 'DDMMYYYY').toDate() : undefined,
        endTime: service.endTime ? moment(service.endTime, 'HHmm').toDate() : undefined,
        description: service.description === '' ? undefined : service.description,
        isEnded: service.isEnded,
        materials: service.materials.map((material) => ({
          materialId: material.id,
          quantity: material.quantity
        })),
      })),
    };

    await serviceOrderMutation.mutateAsync(parsedFormData);

    setIsLoading(false);
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
        getErrorMessage={getErrorMessageByFieldName}
      />;
    case 1:
      return <ServiceStep
        serviceOptions={serviceOptions}
        executorOptions={mechanicOptions}
        materialOptions={materialOptions}
        materialUnits={materialUnits}
        data={formData}
        onDataChange={handleDataChange}
        getErrorMessage={getErrorMessageByFieldName}
      />;
    }
  }

  return (
    <Container headerHeight={headerHeight}>
      <Loader isLoading={
        !trucks ||
        !drivers ||
        !mechanics ||
        !services ||
        !materials ||
        isLoading
      } />
      <CreatedModal isVisible={concludedModalIsVisible} />
      <header>
        {currentStep === 0 && (
          <Link to="/service-orders" className="back-button">
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
