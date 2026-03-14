import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const { data } = await apiClient.post(endpoint, { email, password });
      
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Authentication failed. Please try again.' 
      });
    }
  };

  return (
    <div className="flex h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
        <h2 className="text-2xl font-black uppercase tracking-widest border-b-2 border-black pb-4 mb-6">
          {isLogin ? 'System Login' : 'Register Access'}
        </h2>
        
        {message.text && (
          <div className={`mb-6 p-3 border-2 border-black text-sm font-bold ${message.type === 'error' ? 'bg-red-200 text-red-900' : 'bg-green-200 text-green-900'}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2">Email Identity</label>
            <input 
              type="email" 
              className="w-full border-2 border-black p-3 focus:outline-none focus:bg-yellow-50 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2">Security Key</label>
            <input 
              type="password" 
              className="w-full border-2 border-black p-3 focus:outline-none focus:bg-yellow-50 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-black text-white font-bold uppercase tracking-widest py-4 border-2 border-black hover:bg-white hover:text-black active:translate-y-1 active:shadow-none transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            {isLogin ? 'Authenticate' : 'Initialize User'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage({ type: '', text: '' });
            }}
            className="text-xs font-bold uppercase tracking-wider border-b-2 border-transparent hover:border-black transition-colors"
          >
            {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}