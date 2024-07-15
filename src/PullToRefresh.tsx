import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

// 회전 애니메이션 정의
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// 스타일된 컴포넌트 생성
const PullToRefreshContainer = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 18px;
`;

const RefreshText = styled.div`
  margin-bottom: 10px;
`;

const Loader = styled.div<{ spinning: boolean }>`
  width: 30px;
  height: 30px;
  border: 4px solid #ccc;
  border-radius: 50%;
  border-top-color: #3498db;
  animation: ${(props) => (props.spinning ? `${spin} 1s infinite ease-in-out` : 'none')};
  display: inline-block;
  vertical-align: middle;
`;

const PullToRefresh: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshText, setRefreshText] = useState('Pull to Refresh');

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setRefreshText('Pull to Refresh');
    }, 2000); // Simulate fetching data delay
  };

  const handleTouchStart = () => {
    if (!refreshing) {
      setRefreshText('Release to Refresh');
    }
  };

  const handleTouchEnd = () => {
    if (refreshing) return;

    setRefreshText('Pull to Refresh');
  };

  const handlePull = () => {
    if (!refreshing) {
      handleRefresh(); // Pull을 감지하여 데이터 새로고침 시작
    }
  };

  return (
    <PullToRefreshContainer
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={(e) => e.preventDefault()} // Prevent scrolling on touch move
      onMouseDown={handlePull} // 마우스 이벤트를 추가하여 테스트하기 위해
    >
      <RefreshText>{refreshText}</RefreshText>
      <Loader spinning={refreshing} />
    </PullToRefreshContainer>
  );
};

export default PullToRefresh;
