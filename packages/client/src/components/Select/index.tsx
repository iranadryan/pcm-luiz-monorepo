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
  isModal?: boolean;
  filter?: boolean;
  emptyMessage?: string;
}

export function Select({
  label,
  options,
  placeholder,
  selected,
  onSelect,
  isModal = false,
  filter = false,
  emptyMessage = 'Nenhuma opção encontrada'
}: SelectProps) {
  return (
    <Wrapper>
      {label && <label>{label}</label>}
      <StyledSelect
        options={options}
        placeholder={placeholder}
        value={selected}
        onChange={(e) => onSelect(e.value)}
        panelClassName={isModal ? 'modal' : ''}
        filter={filter}
        emptyFilterMessage={emptyMessage}
      />
    </Wrapper>
  );
}
