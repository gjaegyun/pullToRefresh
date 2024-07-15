import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

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
      setRefreshText('Pull');
    }, 2000);
  };

  const handleTouchStart = () => {
    if (!refreshing) {
      setRefreshText('Release!');
    }
  };

  const handleTouchEnd = () => {
    if (refreshing) return;

    setRefreshText('Refresh!');
  };

  const handlePull = () => {
    if (!refreshing) {
      handleRefresh();
    }
  };

  return (
    <PullToRefreshContainer
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={(e) => e.preventDefault()}
      onMouseDown={handlePull}
    >
      <RefreshText>{refreshText}</RefreshText>
      <Loader spinning={refreshing} />
    </PullToRefreshContainer>
  );
};

export default PullToRefresh;
