import React from 'react';
import styled from 'styled-components';
import { useTelegram } from '../../context/TelegramContext';

const UserProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: var(--border-radius);
  background-color: var(--tg-theme-secondary-bg-color);
  margin-bottom: 20px;
`;

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const UserAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #ccc;
  overflow: hidden;
  margin-right: 15px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  margin: 0 0 5px 0;
  font-size: 18px;
`;

const UserId = styled.p`
  margin: 0;
  color: rgba(var(--tg-theme-text-color-rgb), 0.7);
  font-size: 14px;
`;

const UserDetail = styled.div`
  margin-bottom: 10px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  font-weight: bold;
  display: block;
  margin-bottom: 3px;
  font-size: 14px;
`;

const DetailValue = styled.span`
  display: block;
`;

const ErrorContainer = styled.div`
  padding: 20px;
  border-radius: var(--border-radius);
  background-color: var(--tg-theme-secondary-bg-color);
  margin-bottom: 20px;
  text-align: center;
`;

const UserProfile = () => {
  const { user, initDataError } = useTelegram();
  
  if (!user) {
    return (
      <ErrorContainer>
        <h3>No User Data Available</h3>
        {initDataError ? (
          <p>Cannot retrieve user information: {initDataError}</p>
        ) : (
          <p>User information is not available. This might happen if the app is opened outside of Telegram or if Telegram did not provide user data.</p>
        )}
      </ErrorContainer>
    );
  }
  
  return (
    <UserProfileContainer>
      <UserHeader>
        <UserAvatar>
          {/* Telegram doesn't provide user photos through WebApp API */}
          <img src={`https://via.placeholder.com/64/cccccc/fff?text=${user.first_name?.charAt(0) || 'U'}`} alt="Avatar" />
        </UserAvatar>
        <UserInfo>
          <UserName>
            {user.first_name || 'Unknown'} {user.last_name || ''}
            {user.username && <span> (@{user.username})</span>}
          </UserName>
          <UserId>Telegram ID: {user.id || 'Unknown'}</UserId>
        </UserInfo>
      </UserHeader>
      
      <UserDetail>
        <DetailLabel>Language:</DetailLabel>
        <DetailValue>{user.language_code || 'Not specified'}</DetailValue>
      </UserDetail>
      
      {user.is_premium && (
        <UserDetail>
          <DetailLabel>Status:</DetailLabel>
          <DetailValue>Telegram Premium</DetailValue>
        </UserDetail>
      )}
    </UserProfileContainer>
  );
};

export default UserProfile; 