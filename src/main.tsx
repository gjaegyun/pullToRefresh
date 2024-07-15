import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App
      children={undefined}
      onRefresh={function (): void {
        throw new Error('Function not implemented.');
      }}
      maxDistance={0}
    />
  </React.StrictMode>
);
