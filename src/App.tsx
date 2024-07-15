// App.tsx

import React from 'react';
import PullToRefresh from './PullToRefresh';

const App: React.FC = () => {
  return (
    <div>
      <header>
        <h1>Styled Components Pull to Refresh Example</h1>
      </header>
      <main>
        <PullToRefresh />
      </main>
    </div>
  );
};

export default App;
