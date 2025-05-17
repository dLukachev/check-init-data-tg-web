import { useState } from 'react';
import './ApiTester.css';

const API_BASE_URL = '/api/v1/simple';

const ApiTester = () => {
  const [publicResponse, setPublicResponse] = useState(null);
  const [protectedResponse, setProtectedResponse] = useState(null);
  const [error, setError] = useState(null);

  const formatJson = (data) => {
    return JSON.stringify(data, null, 2);
  };

  const showResponse = (data, setter) => {
    setError(null);
    setter(data);
  };

  const showError = (err) => {
    setPublicResponse(null);
    setProtectedResponse(null);
    setError(err.message || 'An error occurred');
  };

  const callPublicEndpoint = async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      const data = await response.json();
      showResponse(data, setPublicResponse);
    } catch (err) {
      showError(err);
    }
  };

  const callProtectedEndpoint = async (endpoint) => {
    try {
      const initData = window.Telegram.WebApp.initData;
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'X-Telegram-Init-Data': initData
        }
      });
      const data = await response.json();
      showResponse(data, setProtectedResponse);
    } catch (err) {
      showError(err);
    }
  };

  return (
    <div className="api-tester">
      <div className="section">
        <h2>Public Endpoints</h2>
        <div className="endpoint">
          <button onClick={() => callPublicEndpoint('/public/hello')}>
            Test /public/hello
          </button>
        </div>
        <div className="endpoint">
          <button onClick={() => callPublicEndpoint('/public/info')}>
            Test /public/info
          </button>
        </div>
        {publicResponse && (
          <div className="response">
            <pre>{formatJson(publicResponse)}</pre>
          </div>
        )}
      </div>

      <div className="section">
        <h2>Protected Endpoints</h2>
        <div className="endpoint">
          <button onClick={() => callProtectedEndpoint('/protected/profile')}>
            Test /protected/profile
          </button>
        </div>
        <div className="endpoint">
          <button onClick={() => callProtectedEndpoint('/protected/admin-only')}>
            Test /protected/admin-only
          </button>
        </div>
        {protectedResponse && (
          <div className="response">
            <pre>{formatJson(protectedResponse)}</pre>
          </div>
        )}
      </div>

      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default ApiTester; 