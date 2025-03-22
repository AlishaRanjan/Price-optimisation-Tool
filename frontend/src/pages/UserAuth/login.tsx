import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ChangeEvent, FormEvent } from 'react';
import Cookies from 'js-cookie';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 2rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  margin-bottom: 1rem;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #45a049;
  }
`;

const Text = styled.p`
  margin-top: 1rem;
`;

export interface FormData {
    username: string;
    password: string;
}

/**
 * Login Component
 * 
 * Description:
 * The `Login` component allows users to log into the application by providing their username
 * and password. It sends a POST request to the backend to authenticate the user, stores the
 * received tokens and user information in cookies and local storage, and navigates the user
 * to the home page upon successful login. If login fails, it displays an error message.
 */

const Login = () => {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: '',
    });

    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            alert('Username and Password are required!');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/pot/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();

                const token = response.headers.get('Authorization');
                const cleanToken = token ? token.replace('Bearer ', '') : null
                if (cleanToken !== null) {
                    Cookies.set('token', cleanToken, { expires: 1 });
                }

                const userId = data.user_id;
                Cookies.set('user_id', userId.toString(), { expires: 1 });
                const userRole = response.headers.get('User-Role');
                Cookies.set('user_role', userRole || '', { expires: 1 });

                const userName = data.user_name;
                localStorage.setItem('userName', userName);

                navigate('/home');
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (error) {
            setError('An error occurred during login. Please try again.');
        }
    };

    return (
        <LoginContainer>
            <h2>Login</h2>
            <Form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                />
                <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <Button type="submit">Login</Button>
            </Form>
            <Text>
                Don't have an account? <a href="/register">Register here</a>
            </Text>
        </LoginContainer>
    );
};

export default Login;
