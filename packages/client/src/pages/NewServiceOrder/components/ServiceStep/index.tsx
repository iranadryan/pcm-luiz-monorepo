import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash } from 'phosphor-react';
import { useState } from 'react';
import { FormData, Material, Service } from '../..';
import { Button } from '../../../../components/Button';
import { DateInput } from '../../../../components/DateInput';
import { Option, Select } from '../../../../components/Select';
import { TimeInput } from '../../../../components/TimeInput';
import { NoData } from '../../../../components/NoData';
import { ActivitiesList, ActivityInput } from './styles';
import { AddMaterialModal } from '../AddMaterialModal';
import { TextArea } from '../../../../components/TextArea';
import { FormGroup } from '../../../../components/FormGroup';
import { Checkbox } from '../../../../components/Checkbox';

interface ServiceStepProps {
  serviceOptions: Option[];
  executorOptions: Option[];
  materialOptions: Option[];
  materialUnits: {
    id: string;
    unit: string;
  }[];
  data: FormData;
  onDataChange: (
    name: keyof FormData,
    data: string | number | null | undefined | Service[]
  ) => void;
  getErrorMessage: (field: string) => string | undefined;
}

export function ServiceStep({
  serviceOptions,
  executorOptions,
  materialOptions,
  materialUnits,
  data,
  onDataChange,
  getErrorMessage
}: ServiceStepProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [materialModalIsVisible, setMaterialModalIsVisible] = useState(false);
  const [
    addMaterialServiceId,
    setAddMaterialServiceId
  ] = useState<null | string>(null);

  function handleAddService() {
    const services = [...data.services];

    if (!selectedService) {
      return;
    }

    services.push({
      id: uuidv4(),
      serviceId: selectedService,
      name: serviceOptions.find(
        (option) => option.value === selectedService
      )?.label || '',
      startDate: data.startDate,
      startTime: data.startTime,
      endTime: '',
      endDate: '',
      executorId: null,
      description: '',
      isEnded: false,
      materials: []
    });

    onDataChange('services', services);
  }

  function handleRemoveService(id: string) {
    let services = [...data.services];
    services = services.filter((service) => service.id !== id);

    onDataChange('services', services);
  }

  function handleChangeServiceData(
    id: string,
    name: keyof Service,
    value: string | boolean
  ) {
    const services = [...data.services];
    const serviceIndex = services.findIndex(
      (service) => service.id === id
    );

    if (serviceIndex === -1) {
      return;
    }

    services[serviceIndex] = {
      ...services[serviceIndex],
      [name]: value,
    };

    onDataChange('services', services);
  }

  function handleAddMaterial(serviceId: string, material: Material) {
    const services = [...data.services];
    const serviceIndex = services.findIndex(
      (service) => service.id === serviceId
    );

    if (serviceIndex === -1) {
      return;
    }

    const materials = [...data.services[serviceIndex].materials];
    const materialAlreadyExists = materials.find(
      ({ id }) => id === material.id
    );

    if (materialAlreadyExists) {
      return;
    }

    materials.push(material);

    services[serviceIndex] = {
      ...services[serviceIndex],
      materials: materials,
    };

    onDataChange('services', services);
  }

  function handleRemoveMaterial(serviceId: string, materialId: string) {
    const services = [...data.services];
    const serviceIndex = services.findIndex(
      (service) => service.id === serviceId
    );

    if (serviceIndex === -1) {
      return;
    }

    let materials = [...data.services[serviceIndex].materials];
    materials = materials.filter(
      (material) => material.id !== materialId
    );

    services[serviceIndex] = {
      ...services[serviceIndex],
      materials: materials,
    };

    onDataChange('services', services);
  }

  return (
    <>
      <AddMaterialModal
        isVisible={materialModalIsVisible}
        closeModal={() => setMaterialModalIsVisible(false)}
        serviceId={addMaterialServiceId}
        materialOptions={materialOptions}
        materialUnits={materialUnits}
        onAddMaterial={handleAddMaterial}
      />
      <div className="add-activity">
        <Select
          placeholder="Selecione uma atividade"
          options={serviceOptions}
          selected={selectedService}
          onSelect={setSelectedService}
          filter
          emptyMessage="Nenhum serviço encontrado"
        />
        <button onClick={handleAddService}>
          <Plus color="#FFFFFF" size={20} weight="bold" />
        </button>
      </div>
      <small className="error-message">{getErrorMessage('services')}</small>
      <ActivitiesList>
        {data.services.length === 0 && (
          <NoData
            title="Nenhuma atividade inserida!"
            text="Aqui você insere as atividades da sua ordem"
          />
        )}
        {data.services.map((service, index) => (
          <ActivityInput key={service.id}>
            <header>
              <h3>{service.name}</h3>
              <button onClick={
                () => handleRemoveService(service.id)
              }>
                <Trash size={20} color="#E12729" weight="duotone" />
              </button>
            </header>
            <div className="card">
              <DateInput
                label="Data Inicial"
                placeholder="Data Inicial"
                value={service.startDate}
                onChange={(value) => {
                  handleChangeServiceData(service.id, 'startDate', value);
                }}
              />
              <TimeInput
                label="Hora Inicial"
                value={service.startTime}
                onChange={(value) => {
                  handleChangeServiceData(service.id, 'startTime', value);
                }}
              />
              <DateInput
                label="Data Final"
                placeholder="Data Final"
                value={service.endDate}
                onChange={(value) => {
                  handleChangeServiceData(service.id, 'endDate', value);
                }}
              />
              <TimeInput
                label="Hora Final"
                placeholder="Hora Final"
                value={service.endTime}
                onChange={(value) => {
                  handleChangeServiceData(service.id, 'endTime', value);
                }}
              />
              <div className="stretch">
                <FormGroup error={getErrorMessage(`services.${index}.executorId`)}>
                  <Select
                    label="Executante"
                    placeholder="Selecione"
                    options={executorOptions}
                    selected={service.executorId}
                    onSelect={(value) => {
                      handleChangeServiceData(service.id, 'executorId', value);
                    }}
                  />
                </FormGroup>
              </div>
              <div className="stretch">
                <TextArea
                  label="Descrição"
                  placeholder="Descrição da atividade"
                  rows={2}
                  value={service.description}
                  onChange={(value) => {
                    handleChangeServiceData(service.id, 'description', value);
                  }}
                />
              </div>
              {service.materials.length > 0 && (
                <div className="stretch material-list">
                  {service.materials.map((material) => (
                    <div key={material.id} className="material-item">
                      <span>{`${material.quantity} ${material.unit}`}</span>
                      <strong>{material.name}</strong>
                      <button onClick={() => {
                        handleRemoveMaterial(
                          service.id, material.id
                        );
                      }}>
                        <Trash size={20} color="#E12729" weight="duotone" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <Checkbox
                name="isEnded"
                label="Finalizado"
                checked={service.isEnded}
                onCheck={() => {
                  handleChangeServiceData(service.id, 'isEnded', !service.isEnded);
                }}
              />
              <Button
                secondary
                onClick={() => {
                  setAddMaterialServiceId(service.id);
                  setMaterialModalIsVisible(true);
                }}
              >
                <Plus size={16} color="#FFFFFF" weight="bold" />
                Material
              </Button>
            </div>
          </ActivityInput>
        ))}
      </ActivitiesList>
    </>
  );
}
