import { Check } from 'phosphor-react';
import { StyledCheckbox, Wrapper } from './styles';

interface CheckboxProps {
  name: string;
  label: string;
  checked: boolean;
  onCheck: () => void;
}

export function Checkbox({ name, label, checked, onCheck }: CheckboxProps) {
  return (
    <Wrapper>
      <StyledCheckbox id={name} checked={checked} onChange={() => onCheck()} />
      {checked && (
        <Check
          onClick={() => onCheck()}
          className="check"
          color="#FFFFFF"
          size={20}
          weight="bold"
        />
      )}
      <label htmlFor={name}>{label}</label>
    </Wrapper>
  );
}
