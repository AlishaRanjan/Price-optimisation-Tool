import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';


export const isAuthenticated = () => {
    const token = Cookies.get('token');
    const userRole = Cookies.get('user_role');
    const userId = Cookies.get('user_id');
    console.log('isAuthenticated')
    if (token && userRole && userId) {
        return true;
    }
    return false;
};

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    return (props: P & {}) => {
        if (isAuthenticated()) {
            return <WrappedComponent {...props} />;
        } else {
            return <Navigate to="/login" />;
        }
    };
};

export default withAuth;
