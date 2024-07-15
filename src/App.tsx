import React, { useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface Props {
  handleRefresh: () => void;
}

const PullToRefresh: React.FC<Props> = ({ handleRefresh }) => {
  const div = useRef<HTMLDivElement | null>(null);
  const [isPulling, setIsPulling] = useState(false);
  const touchStartY = useRef(0);
  const loadingHeight = useRef(0);

  const MAX_HEIGHT = 60;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (div.current && div.current.scrollTop !== 0) return;
    touchStartY.current = e.changedTouches[0].screenY;
    setIsPulling(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isPulling) {
      const screenY = e.changedTouches[0].screenY;
      const height = Math.floor((screenY - touchStartY.current) * 0.3);
      if (height >= 0) {
        loadingHeight.current = height;
      }
    }
  };

  const handleTouchEnd = () => {
    if (loadingHeight.current >= MAX_HEIGHT) {
      handleRefresh();
    }
    setIsPulling(false);
    loadingHeight.current = 0;
    touchStartY.current = 0;
  };

  return (
    <Container ref={div} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      <LoadingElement style={{ height: `${loadingHeight.current}px` }} isPulling={isPulling} />
      loading components
    </Container>
  );
};

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Container = styled.div`
  overflow-y: scroll;
  height: 100vh;
`;

const LoadingElement = styled.div<{ isPulling: boolean }>`
  background: lightgray;
  width: 100%;
  transition: height 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  &::after {
    content: '';
    border: 4px solid lightgray;
    border-top: 4px solid gray;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: ${spin} 1s linear infinite;
    opacity: ${({ isPulling }) => (isPulling ? 1 : 0)};
  }
`;

export default PullToRefresh;
