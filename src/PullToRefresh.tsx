import React, { useState, useRef, TouchEvent, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

interface Props {
  children: React.ReactNode;
  onRefresh: () => void;
  maxDistance: number;
}

const MAX_PULLED_DISTANCE = 30;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

const SpinnerBox = styled.div<{ pulledDistance: number }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease-out;
  transform: translateY(${(props) => props.pulledDistance}px);
`;

const Spinner = styled.div<{ height: number }>`
  width: 30px;
  height: ${(props) => props.height}px;
  border: 4px solid #ccc;
  border-radius: 50%;
  border-top-color: #3498db;
  animation: ${spin} 1s infinite ease-in-out;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  vertical-align: middle;
`;

const PullToRefresh: React.FC<Props> = ({ children, onRefresh, maxDistance }) => {
  const spinnerRef = useRef<HTMLDivElement>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [pulledDistance, setPulledDistance] = useState(0); // 텍스트와 스피너가 아래로 내려가는 거리 상태 추가
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    if (isRefreshing) {
      setShowSpinner(true);
      setTimeout(() => {
        setShowSpinner(false);
        setIsRefreshing(false);
        resetToInitial();
      }, 1500);
    }
  }, [isRefreshing]);

  const resetToInitial = () => {
    setPulledDistance(0);
    if (spinnerRef.current) {
      spinnerRef.current.style.height = '0';
      spinnerRef.current.style.willChange = 'unset';
    }
  };

  const onTouchStart = (e: TouchEvent) => {
    setStartY(e.touches[0].clientY);
    if (spinnerRef.current) {
      spinnerRef.current.style.willChange = 'height';
    }
  };

  const onTouchMove = (e: TouchEvent) => {
    const moveY = e.touches[0].clientY;
    const distance = Math.min(Math.pow(moveY - startY, 0.875), maxDistance);

    setPulledDistance(distance);

    if (distance <= 0) {
      enableBodyScroll();
      resetToInitial();
    }

    if (distance > 0) {
      preventBodyScroll();
    }

    if (distance >= maxDistance) {
      setIsRefreshing(true);
    } else {
      setIsRefreshing(false);
    }
  };

  const onTouchEnd = () => {
    enableBodyScroll();
    if (isRefreshing) {
      onRefresh();
    } else {
      resetToInitial();
    }
  };

  const preventBodyScroll = () => {
    document.body.style.overflow = 'hidden';
  };

  const enableBodyScroll = () => {
    document.body.style.overflow = 'auto';
  };

  return (
    <Wrapper>
      <SpinnerBox pulledDistance={pulledDistance}>
        <div ref={spinnerRef}>{showSpinner && <Spinner height={MAX_PULLED_DISTANCE} />}</div>
        <div onTouchStart={(e) => onTouchStart(e)} onTouchMove={(e) => onTouchMove(e)} onTouchEnd={() => onTouchEnd()}>
          {children}
        </div>
      </SpinnerBox>
    </Wrapper>
  );
};

export default PullToRefresh;
