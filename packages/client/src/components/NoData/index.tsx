import { Container } from './styles';
import NoDataIllustration from '../../assets/images/no-data.svg';

interface NoDataProps {
  title: string;
  text: string;
}

export function NoData({ title, text }: NoDataProps) {
  return (
    <Container>
      <img src={NoDataIllustration} alt="No data illustrations" />
      <h3>{title}</h3>
      <p>{text}</p>
    </Container>
  );
}
