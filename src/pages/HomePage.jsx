import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTelegram } from '../context/TelegramContext';
import UserProfile from '../components/UserProfile/UserProfile';
import { authService, userService } from '../services/api';

const HomeContainer = styled.div`
  padding: 20px;
`;

const Header = styled.h1`
  margin-bottom: 20px;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  
  &::after {
    content: '';
    width: 30px;
    height: 30px;
    border: 4px solid var(--tg-theme-button-color);
    border-top-color: transparent;
    border-radius: 50%;
    animation: spinner 1s linear infinite;
  }
  
  @keyframes spinner {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  padding: 20px;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: var(--border-radius);
  margin-bottom: 20px;
`;

const InfoMessage = styled.div`
  color: #3498db;
  text-align: center;
  padding: 20px;
  background-color: rgba(52, 152, 219, 0.1);
  border-radius: var(--border-radius);
  margin-bottom: 20px;
`;

const Button = styled.button`
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
  display: block;
`;

const HomePage = () => {
  const { 
    ready, 
    user: telegramUser, 
    tg, 
    telegramAvailable, 
    initDataError 
  } = useTelegram();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendUser, setBackendUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);

  const authenticateUser = async () => {
    if (!ready || !telegramUser) return;
    
    // Don't attempt authentication if we know init data is missing
    if (initDataError) {
      console.log('Skipping authentication due to initData error');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Try to authenticate with Telegram
      const authResponse = await authService.loginWithTelegram();
      console.log('Authentication successful:', authResponse);
      
      // Fetch user data
      const userData = await userService.getCurrentUser();
      setBackendUser(userData);
      
      // Fetch user roles using the new endpoint
      if (userData && userData.user && userData.user.id) {
        const roles = await userService.getUserRoles(userData.user.id);
        setUserRoles(roles);
      }
      
      // Set the main button if needed
      if (tg?.MainButton) {
        tg.MainButton.setText('Show More Actions');
        tg.MainButton.show();
        tg.MainButton.onClick(() => {
          alert('Main button clicked!');
        });
      }
    } catch (err) {
      console.error('Error during authentication:', err);
      setError(err.message || 'Failed to authenticate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    authenticateUser();
  }, [ready, telegramUser, tg, initDataError]);

  const handleRetry = () => {
    authenticateUser();
  };

  if (!telegramAvailable) {
    return (
      <HomeContainer>
        <Header>Error</Header>
        <ErrorMessage>
          This app must be opened from within Telegram. 
          Please open this app using Telegram's WebApp feature.
        </ErrorMessage>
      </HomeContainer>
    );
  }

  if (!ready) {
    return (
      <HomeContainer>
        <LoadingSpinner />
        <p style={{ textAlign: 'center' }}>Initializing Telegram Mini App...</p>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <Header>Telegram User Profile</Header>
      
      {initDataError && (
        <InfoMessage>
          {initDataError}
          <br />
          <small>Some features may be limited</small>
        </InfoMessage>
      )}
      
      {error && (
        <ErrorMessage>
          {error}
          <Button onClick={handleRetry}>Retry Authentication</Button>
        </ErrorMessage>
      )}
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <UserProfile />
          {backendUser && (
            <div className="card">
              <h3>Backend User Data</h3>
              <pre>{JSON.stringify(backendUser, null, 2)}</pre>
            </div>
          )}
          {userRoles.length > 0 && (
            <div className="card">
              <h3>User Roles</h3>
              <ul>
                {userRoles.map(role => (
                  <li key={role.id}>{role.name}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </HomeContainer>
  );
};

export default HomePage; 