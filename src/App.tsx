import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

interface Props {
  handleRefresh: () => void;
}

const App: React.FC<Props> = ({ handleRefresh }) => {
  const div = useRef<HTMLDivElement | null>(null);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
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
      setIsRefreshing(true);
      handleRefresh();
      setTimeout(() => {
        setIsRefreshing(false);
      }, 2000); // Simulate loading time
    }
    setIsPulling(false);
    loadingHeight.current = 0;
    touchStartY.current = 0;
  };

  useEffect(() => {
    if (!isRefreshing) {
      setIsPulling(false);
    }
  }, [isRefreshing]);

  return (
    <Container ref={div} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      <LoadingElement
        style={{ height: `${loadingHeight.current}px` }}
        isPulling={isPulling}
        isRefreshing={isRefreshing}
      >
        {isRefreshing ? 'loading...' : 'hello'}
      </LoadingElement>
      hello
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

const LoadingElement = styled.div<{ isPulling: boolean; isRefreshing: boolean }>`
  background: ${({ isRefreshing }) => (isRefreshing ? 'gray' : 'lightgray')};
  width: 100%;
  transition: height 0.3s ease, background 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  &::after {
    content: '';
    border: 4px solid ${({ isRefreshing }) => (isRefreshing ? 'darkgray' : 'lightgray')};
    border-top: 4px solid ${({ isRefreshing }) => (isRefreshing ? 'white' : 'gray')};
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: ${({ isRefreshing }) => (isRefreshing ? `${spin} 1s linear infinite` : 'none')};
    opacity: ${({ isPulling }) => (isPulling ? 1 : 0)};
  }
`;

export default App;
