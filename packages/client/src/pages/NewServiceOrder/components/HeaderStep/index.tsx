import { Activity, FormData } from '../..';
import { DateInput } from '../../../../components/DateInput';
import { Input } from '../../../../components/Input';
import { Option, Select } from '../../../../components/Select';
import { TextArea } from '../../../../components/TextArea';
import { TimeInput } from '../../../../components/TimeInput';

interface HeaderStepProps {
  plateOptions: Option[];
  driverOptions: Option[];
  data: FormData;
  onDataChange: (
    name: keyof FormData, data: string | number | Activity[]
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
        selected={data.plate}
        onSelect={(value) => onDataChange('plate', value)}
      />
      <Select
        label="Motorista"
        placeholder="Selecione um motorista"
        options={driverOptions}
        selected={data.driver}
        onSelect={(value) => onDataChange('driver', value)}
      />
      <Input
        label="Kilmetros"
        placeholder="Insira a kilometragem atual"
        type="number"
        value={data.kilometers}
        min={0}
        step=".01"
        onChange={(e) => onDataChange('kilometers', e.target.value)}
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
