import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const loading = () => {
  return <div>loading...</div>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App handleRefresh={loading} />
  </React.StrictMode>
);
