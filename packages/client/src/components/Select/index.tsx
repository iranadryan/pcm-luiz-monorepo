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
  secondary?: boolean;
}

export function Select({
  label,
  options,
  placeholder,
  selected,
  onSelect,
  isModal = false,
  filter = false,
  emptyMessage = 'Nenhuma opção encontrada',
  secondary = false,
}: SelectProps) {
  return (
    <Wrapper secondary={secondary}>
      {label && <label>{label}</label>}
      <StyledSelect
        secondary={secondary}
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
