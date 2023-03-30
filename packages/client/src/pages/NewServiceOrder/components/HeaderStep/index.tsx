import { FormData, Service } from '../..';
import { DateInput } from '../../../../components/DateInput';
import { FormGroup } from '../../../../components/FormGroup';
import { InputNumber } from '../../../../components/InputNumber';
import { Option, Select } from '../../../../components/Select';
import { TextArea } from '../../../../components/TextArea';
import { TimeInput } from '../../../../components/TimeInput';

interface HeaderStepProps {
  plateOptions: Option[];
  driverOptions: Option[];
  data: FormData;
  onDataChange: (
    name: keyof FormData,
    data: string | number | null | undefined | Service[]
  ) => void;
  getErrorMessage: (field: string) => string | undefined;
}

export function HeaderStep({
  plateOptions,
  driverOptions,
  data,
  onDataChange,
  getErrorMessage,
}: HeaderStepProps) {
  return (
    <>
      <div className="date-input">
        <FormGroup error={getErrorMessage('startDate')}>
          <DateInput
            label="Data Inicial"
            placeholder="Data Inicial"
            value={data.startDate}
            onChange={(value) => onDataChange('startDate', value)}
          />
        </FormGroup>
        <FormGroup error={getErrorMessage('startTime')}>
          <TimeInput
            label="Hora Inicial"
            placeholder="Hora Inicial"
            value={data.startTime}
            onChange={(value) => onDataChange('startTime', value)}
          />
        </FormGroup>
      </div>
      <FormGroup error={getErrorMessage('truckId')}>
        <Select
          label="Placa"
          placeholder="Selecione uma placa"
          options={plateOptions}
          selected={data.truckId}
          onSelect={(value) => onDataChange('truckId', value)}
          filter
          emptyMessage="Nenhuma placa encontrada"
        />
      </FormGroup>
      <FormGroup error={getErrorMessage('driverId')}>
        <Select
          label="Motorista"
          placeholder="Selecione um motorista"
          options={driverOptions}
          selected={data.driverId}
          onSelect={(value) => onDataChange('driverId', value)}
          filter
          emptyMessage="Nenhum motorista encontrado"
        />
      </FormGroup>
      <FormGroup error={getErrorMessage('odometer')}>
        <InputNumber
          label="Kilometros"
          placeholder="Insira a kilometragem atual"
          value={data.odometer}
          onChange={(value) => onDataChange('odometer', value)}
        />
      </FormGroup>
      <TextArea
        label="Observação"
        placeholder="Insira observações, caso haja"
        value={data.observation}
        onChange={(value) => onDataChange('observation', value)}
      />
    </>
  );
}
