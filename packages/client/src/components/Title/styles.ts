import styled from 'styled-components';

export const StyledHeading = styled.h2`
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #005125;
  position: relative;

  &::before {
    content: '';
    height: 3px;
    width: 120px;
    background: #F37324;
    position: absolute;
    bottom: -1px;
    left: 0;
  }
`;
