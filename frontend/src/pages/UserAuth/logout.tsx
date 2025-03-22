import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useCallback } from 'react';
import { getHeaders } from '../../ducks/utils';


/**
 * Custom Hook: useLogout
 * 
 * Description:
 * The `useLogout` hook provides a mechanism to handle user logout functionality.
 * It sends a POST request to the backend API to log out the user, clears cookies
 * and local storage, and then navigates the user to the login page.
 */
const useLogout = () => {
    const navigate = useNavigate();

    const handleLogout = useCallback(async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/pot/auth/logout/', {
                method: 'POST',
                headers: getHeaders(),
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }
            Cookies.remove('token');
            Cookies.remove('user_role');
            Cookies.remove('user_id');
            localStorage.removeItem('userName');

            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }, [navigate]);

    return handleLogout;
};

export default useLogout;
