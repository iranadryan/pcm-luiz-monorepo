import Lottie from 'lottie-react';
import { ReactPortal } from '../ReactPortal';
import { Overlay } from './styles';
import loadingAnimation from '../../assets/lotties/loading.json';

interface LoaderProps {
  isLoading: boolean;
}

export function Loader({ isLoading }: LoaderProps) {
  if (!isLoading) {
    return null;
  }

  return (
    <ReactPortal containerId="loader-root">
      <Overlay>
        <Lottie
          animationData={loadingAnimation}
          loop
          style={{
            height: 140
          }}
        />
      </Overlay>
    </ReactPortal>
  );
}
