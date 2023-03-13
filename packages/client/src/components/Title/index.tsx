import { StyledHeading } from './styles';

interface TitleProps {
  title: string;
}

export function Title({ title }: TitleProps) {
  return (
    <StyledHeading>{title}</StyledHeading>
  );
}
