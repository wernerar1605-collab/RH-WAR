
import React, { useState } from 'react';
import { SystemUser } from '../types';

interface LoginProps {
  onLoginSuccess: (user: Partial<SystemUser>) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Simulação de usuários para login com Roles definidos
  const validUsers = [
    { login: 'admin', password: 'admin', role: 'Administrador', name: 'Administrador' },
    { login: 'gestora', password: 'wv160517', role: 'Gestora', name: 'Maria Silva' },
    { login: 'coordenadora', password: 'wv160517', role: 'Coordenadora', name: 'Fernanda Souza' },
    { login: 'usuario', password: 'wv160517', role: 'Usuário', name: 'João Pereira' }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Encontra o usuário completo
    const user = validUsers.find(u => u.login === login && u.password === password);

    if (user) {
      setError('');
      // Passa o usuário encontrado (com a role) para o callback
      onLoginSuccess(user as Partial<SystemUser>);
    } else {
      setError('Login ou senha inválidos.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-xl shadow-md border border-gray-200">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">RH-WAR</h1>
          <p className="mt-2 text-sm text-gray-500">Acesse sua conta para continuar</p>
        </div>
        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="login-address" className="sr-only">
                Login
              </label>
              <input
                id="login-address"
                name="login"
                type="text"
                autoComplete="username"
                required
                className="appearance-none block w-full px-4 py-3 bg-white border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                placeholder="Login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none block w-full px-4 py-3 bg-white border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          {error && (
            <div className="bg-rose-100 border-l-4 border-rose-500 text-rose-700 p-3 text-sm rounded" role="alert">
                <p>{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
