import { Check } from 'phosphor-react';
import { StyledCheckbox, Wrapper } from './styles';
import { CSSProperties } from 'react';

interface CheckboxProps {
  name: string;
  label: string;
  checked: boolean;
  onCheck: () => void;
  style?: CSSProperties;
}

export function Checkbox({ name, label, checked, onCheck, style }: CheckboxProps) {
  return (
    <Wrapper style={style}>
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
