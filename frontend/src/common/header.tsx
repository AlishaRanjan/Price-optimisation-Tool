import { useState } from 'react';
import styled from 'styled-components';
import useLogout from '../pages/UserAuth/logout';
import { User } from 'lucide-react';

export const Avatar = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background-color: #374151;
  cursor: pointer;
`;

export const Dropdown = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  padding: 4px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0);
  min-width: 60px;
  margin-right: 10px;
  z-index: 1;
`;

export const LogoutButton = styled.button`
  width: 100%;
  padding: 8px;
  background-color: white;
  border: none;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  color: #f8fafc;
`;

export const Title = styled.h1`
  color: #10b981;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const HeaderComponent = () => {
  const [userIconClicked, setUserIconClicked] = useState<boolean>(false);
  const logoutHook = useLogout();
  const userName = localStorage.getItem('userName');


  const handleLogout = async () => {
    try {
      await logoutHook();
      setUserIconClicked(false);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <Header>
      <Title>Price Optimization Tool</Title>
      <UserSection>
        <span>Welcome, {userName}</span>
        <Avatar onClick={() => setUserIconClicked((prev) => !prev)} >
          <User size={16} color="white" width={'100%'} height={'100%'} />
        </Avatar>
        {userIconClicked && (
          <Dropdown>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </Dropdown>
        )}
      </UserSection>
    </Header>
  );
};

export default HeaderComponent;
