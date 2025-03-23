import React from 'react';
import ReactDOM from 'react-dom/client'; // 'react-dom' ではなく 'react-dom/client' を使用
import App from './App.tsx';

// React アプリケーションのルート作成
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// アプリケーションを描画
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
