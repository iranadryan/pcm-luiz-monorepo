import { CaretDown } from 'phosphor-react';
import { StyledSelect, Wrapper } from './styles';

export type Option = {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: Option[];
  placeholder?: string;
  selected: string | null;
  onSelect: (value: string) => void;
}

export function Select({
  label,
  options,
  placeholder,
  selected,
  onSelect
}: SelectProps) {
  return (
    <Wrapper>
      {label && <label>{label}</label>}
      <StyledSelect
        options={options}
        suffixIcon={<CaretDown size={20} color="#005125" weight="bold" />}
        placeholder={placeholder}
        value={selected}
        onSelect={(value) => {
          onSelect(value as string);
        }}
      />
    </Wrapper>
  );
}
