const API_URL = 'http://127.0.0.1:5000/api';

interface AuthResponse {
    message: string;
    token: string;
    user: {
        name: string;
        email: string;
        role: string;
    };
}

export const auth = {
    async register(name: string, email: string, password: string, role: string): Promise<AuthResponse> {
        console.log('Starting registration request with:', { name, email, role });
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                mode: 'cors',
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role,
                }),
            });

            if (!response) {
                console.error('No response received from server');
                throw new Error('Не може да се свърже със сървъра. Моля проверете дали сървърът работи.');
            }

            console.log('Registration response status:', response.status);
            let data;
            try {
                data = await response.json();
                console.log('Registration response data:', data);
            } catch (error) {
                console.error('Error parsing response:', error);
                throw new Error('Неочакван отговор от сървъра.');
            }
            
            if (!response.ok) {
                console.error('Registration failed:', data.message);
                throw new Error(data.message || 'Registration failed');
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
                console.log('Registration successful, token stored');
            } else {
                console.warn('No token received in successful registration');
            }
            
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                throw new Error('Не може да се свърже със сървъра. Моля проверете дали сървърът работи.');
            }
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Възникна неочаквана грешка.');
        }
    },

    async login(email: string, password: string): Promise<AuthResponse> {
        console.log('Starting login request with email:', email);
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                mode: 'cors',
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            console.log('Login response status:', response.status);
            const data = await response.json();
            console.log('Login response data:', data);
            
            if (!response.ok) {
                console.error('Login failed:', data.message);
                throw new Error(data.message || 'Login failed');
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
                console.log('Login successful, token stored');
            } else {
                console.warn('No token received in successful login');
            }
            
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async verifyToken(): Promise<AuthResponse> {
        console.log('Starting token verification');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.warn('No token found for verification');
                throw new Error('No token found');
            }

            const response = await fetch(`${API_URL}/auth/verify`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                mode: 'cors',
            });

            console.log('Token verification response status:', response.status);
            const data = await response.json();
            console.log('Token verification response data:', data);
            
            if (!response.ok) {
                console.error('Token verification failed:', data.message);
                localStorage.removeItem('token');
                throw new Error(data.message || 'Invalid token');
            }

            return data;
        } catch (error) {
            console.error('Token verification error:', error);
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('token');
    },

    getToken() {
        return localStorage.getItem('token');
    },
}; 