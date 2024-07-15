import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const MAX_HEIGHT = 60;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const PullToRefreshContainer = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 18px;
  overflow: auto; /* 스크롤 가능하도록 설정 */
  height: 300px; /* 예시로 고정된 높이 설정 */
`;

const RefreshText = styled.div`
  margin-bottom: 10px;
`;

const Loader = styled.div<{ height: number }>`
  width: 30px;
  height: ${(props) => props.height}px;
  border: 4px solid #ccc;
  border-radius: 50%;
  border-top-color: #3498db;
  animation: ${spin} 1s infinite ease-in-out;
  display: inline-block;
  vertical-align: middle;
`;

const PullToRefresh: React.FC = () => {
  const [refreshText, setRefreshText] = useState('Pull to Refresh');
  const [loadingHeight, setLoadingHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const touchStartY = useRef(0);
  const divRef = useRef<HTMLDivElement>(null);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRefreshText('Pull to Refresh');
    }, 2000);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (divRef.current?.scrollTop !== 0) return;
    touchStartY.current = e.changedTouches[0].screenY;
    const el = document.createElement('div');
    el.classList.add('loading-element'); // 스타일을 지정해주자.
    divRef.current?.prepend(el); // 스크롤되는 요소의 최상단에 추가해준다.
    setLoadingHeight(0);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!loading) return;

    const screenY = e.changedTouches[0].screenY;
    const height = Math.floor((screenY - touchStartY.current) * 0.3);

    if (height >= 0) {
      setLoadingHeight(height);
    }
  };

  const handleTouchEnd = () => {
    if (loadingHeight >= MAX_HEIGHT) {
      handleRefresh();
      if (divRef.current) {
        divRef.current.removeChild(divRef.current.firstChild!);
      }
    }
    setLoadingHeight(0);
  };

  return (
    <PullToRefreshContainer
      ref={divRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <RefreshText>{refreshText}</RefreshText>
      {loading && <Loader height={loadingHeight} />}
    </PullToRefreshContainer>
  );
};

export default PullToRefresh;
