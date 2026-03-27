import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, Sparkles } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch {
            setError('Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md">
                {/* Logo/Title */}
                <div className="text-center mb-8 animate-fadeInDown">
                    <div className="inline-flex items-center justify-center mb-4">
                        <Sparkles className="w-12 h-12 text-yellow-300 animate-pulse-slow" />
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-2">Blog</h1>
                    <p className="text-white/80">Bienvenue sur votre plateforme</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-scaleIn">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 mb-4 animate-fadeInUp">
                            <LogIn className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 animate-fadeInUp delay-100">Connexion</h2>
                        <p className="text-gray-500 mt-1 animate-fadeInUp delay-200">Connectez-vous à votre compte</p>
                    </div>

                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200 animate-fadeInUp">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="animate-fadeInUp delay-300">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-purple-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="votre@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="animate-fadeInUp delay-400">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mot de passe
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-purple-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-gradient btn-ripple text-white font-semibold py-3 rounded-lg shadow-lg disabled:opacity-50 animate-fadeInUp delay-500"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Connexion...
                                </span>
                            ) : (
                                'Se connecter'
                            )}
                        </button>
                    </form>

                    <div className="text-center pt-4 border-t border-gray-200 animate-fadeInUp delay-500">
                        <p className="text-sm text-gray-600">
                            Pas encore de compte ?{' '}
                            <Link to="/register" className="font-semibold gradient-text hover:underline">
                                Créer un compte
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Demo credentials hint */}
                <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg text-white text-sm text-center animate-fadeInUp delay-500">
                    <p className="font-semibold mb-1">Identifiants de test :</p>
                    <p>Email: test@example.com</p>
                    <p>Mot de passe: password</p>
                </div>
            </div>
        </div>
    );
}
