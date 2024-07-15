import React from 'react';
import PullToRefresh from './PullToRefresh';

const App: React.FC = () => {
  const handleRefresh = () => {
    // 새로고침 로직 구현
    console.log('Refreshing...');
  };
  return (
    <div>
      <main>
        <PullToRefresh onRefresh={handleRefresh} maxDistance={100} children={<div>Pull To Refresh</div>} />
      </main>
    </div>
  );
};

export default App;
