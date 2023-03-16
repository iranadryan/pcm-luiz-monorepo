import { FormData, Service } from '../..';
import { DateInput } from '../../../../components/DateInput';
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
}

export function HeaderStep({
  plateOptions,
  driverOptions,
  data,
  onDataChange
}: HeaderStepProps) {
  return (
    <>
      <div className="date-input">
        <DateInput
          label="Data Inicial"
          placeholder="Data Inicial"
          value={data.startDate}
          onChange={(value) => onDataChange('startDate', value)}
        />
        <TimeInput
          label="Hora Inicial"
          placeholder="Hora Inicial"
          value={data.startTime}
          onChange={(value) => onDataChange('startTime', value)}
        />
      </div>
      <Select
        label="Placa"
        placeholder="Selecione uma placa"
        options={plateOptions}
        selected={data.truckId}
        onSelect={(value) => onDataChange('truckId', value)}
      />
      <Select
        label="Motorista"
        placeholder="Selecione um motorista"
        options={driverOptions}
        selected={data.driverId}
        onSelect={(value) => onDataChange('driverId', value)}
      />
      <InputNumber
        label="Kilmetros"
        placeholder="Insira a kilometragem atual"
        value={data.odometer}
        onChange={(value) => onDataChange('odometer', value)}
      />
      <TextArea
        label="Observação"
        placeholder="Insira observações, caso haja"
        value={data.observation}
        onChange={(value) => onDataChange('observation', value)}
      />
    </>
  );
}
