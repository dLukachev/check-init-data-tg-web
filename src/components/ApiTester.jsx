import { useState } from 'react';
import './ApiTester.css';

const API_BASE_URL = '/api/v1';

const ApiTester = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const formatJson = (data) => {
    return JSON.stringify(data, null, 2);
  };

  const showResponse = (data) => {
    setError(null);
    setResponse(data);
  };

  const showError = (err) => {
    setResponse(null);
    setError(err.message || 'An error occurred');
  };

  const callEndpoint = async (endpoint, method = 'GET', headers = {}) => {
    try {
      const initData = window.Telegram.WebApp.initData;
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
          'Telegram-Init-Data': initData,
          ...headers
        }
      });
      const data = await response.json();
      showResponse(data);
    } catch (err) {
      showError(err);
    }
  };

  return (
    <div className="api-tester">
      <div className="section">
        <h2>Telegram Mini App Endpoints</h2>
        <div className="endpoint">
          <button onClick={() => callEndpoint('/auth/login/telegram', 'POST')}>
            Login with Telegram
          </button>
        </div>
        <div className="endpoint">
          <button onClick={() => callEndpoint('/auth/tma-security')}>
            Get Security Info
          </button>
        </div>
        {response && (
          <div className="response">
            <pre>{formatJson(response)}</pre>
          </div>
        )}
      </div>

      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default ApiTester; 