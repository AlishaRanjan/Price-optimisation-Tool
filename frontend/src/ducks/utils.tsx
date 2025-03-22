import Cookies from "js-cookie";

/**
 * Function: getHeaders
 * 
 * Description:
 * Retrieves and constructs the headers required for making HTTP requests.
 * It fetches the user's authentication token, user ID, and user role from the cookies.
 * If the token, user ID, and user role exist, they are included in the request headers.
 * The headers are primarily used for making authenticated API calls to the backend.
 * ```
 */
export const getHeaders = (): Record<string, string> => {
    const token = Cookies.get('token');
    const userId = Cookies.get('user_id');
    const userRole = Cookies.get('user_role');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) headers['Authorization'] = `${token}`;
    if (userId) headers['User-Id'] = userId;
    if (userRole) headers['User-Role'] = userRole;
    return headers;
};


/**
 * Function: handleUnauthorized
 * 
 * Description:
 * Handles unauthorized access or session expiration by clearing all authentication-related data.
 * When an unauthorized response is detected, this function removes the user's token, user ID, 
 * and user role from the cookies and clears the localStorage to wipe out any user-specific data.
 * Once the data is cleared, the user is redirected to the login page (`/login`).
 * ```
 */
export const handleUnauthorized = () => {
    Cookies.remove('token');
    Cookies.remove('user_id');
    Cookies.remove('user_role');

    localStorage.clear();
    window.location.href = '/login';
};