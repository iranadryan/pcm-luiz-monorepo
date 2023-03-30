import Lottie from 'lottie-react';
import { ReactPortal } from '../ReactPortal';
import { Overlay } from './styles';
import loadingAnimation from '../../assets/lotties/loading.json';
import useAnimatedUnmount from '../../hooks/useAnimatedUnmount';

interface LoaderProps {
  isLoading: boolean;
}

export function Loader({ isLoading }: LoaderProps) {
  const { shouldRender, animatedElementRef } = useAnimatedUnmount(isLoading);

  if (!shouldRender) {
    return null;
  }

  return (
    <ReactPortal containerId="loader-root">
      <Overlay ref={animatedElementRef} isLeaving={!isLoading}>
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
