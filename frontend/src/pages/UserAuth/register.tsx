import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ChangeEvent, FormEvent } from 'react';

const RegisterContainer = styled.div`
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
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const Text = styled.p`
  margin-top: 1rem;
`;

export interface FormData {
    username: string;
    password: string;
    name: string;
    email: string;
}
/**
 * Component: Register
 * 
 * Description:
 * The Register component provides a user registration form that allows users to create a new account
 * by filling in their username, name, email, and password. Upon submission, the form sends a POST request
 * to the backend API to register the user. If successful, it redirects the user to the login page.
 * ```
 */

const Register = () => {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: '',
        name: '',
        email: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!formData.username || !formData.password || !formData.name || !formData.email) {
            alert('All fields are required!');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/pot/auth/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                navigate('/login');
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (error) {
            setError('An error occurred during registration. Please try again.');
        }
    };

    return (
        <RegisterContainer>
            <h2>Register</h2>
            <Form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <Input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <Button type="submit">Register</Button>
            </Form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Text>
                Already have an account? <Link to="/login">Login here</Link>
            </Text>
        </RegisterContainer>
    );
};

export default Register;
