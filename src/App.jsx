import { useEffect } from 'react';
import ApiTester from './components/ApiTester';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize Telegram Mini App
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.enableClosingConfirmation();
  }, []);

  return (
    <div className="app">
      <ApiTester />
    </div>
  );
}

export default App;
