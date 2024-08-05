import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signin } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';

const Signin: React.FC = () => {
    const { setUsername } = useAuth();
    const navigate = useNavigate();

    const [username, setUsernameState] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            await signin(username, password);
            localStorage.setItem('username', username);
            setUsername(username);
            navigate('/home');
        } catch (err) {
            setError('Usuário ou Senha incorretos');
        }
    };

    return (
        <div className="signin-background d-flex justify-content-center align-items-center vh-100">
            <div id="signin-form-content" className="p-4 rounded-5 bg-body-secondary">
                <h2 className="text-center mb-4">Entrar</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label htmlFor="username" className="p-1 form-label rounded-4 bg-secondary-subtle">Usuário</label>
                        <input
                            type="text"
                            id="username"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsernameState(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="password" className="p-1 form-label rounded-4 bg-secondary-subtle">Senha</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                    <button type="submit" className="btn btn-primary w-100">ENTRAR</button>
                </form>
                <div className="mt-2 text-center">
                    <p className="mb-0">Ainda não tem uma conta?</p>
                    <Link to="/signup" className="btn btn-link">Registrar</Link>
                </div>
            </div>
        </div>
    );
};

export default Signin;
