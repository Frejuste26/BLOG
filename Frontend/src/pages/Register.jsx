import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            navigate('/');
        } catch {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md">
                {/* Logo/Title */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-white mb-2">Blog</h1>
                    <p className="text-white/80">Rejoignez notre communauté</p>
                </div>

                {/* Register Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 mb-4">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Inscription</h2>
                        <p className="text-gray-500 mt-1">Créez votre compte gratuitement</p>
                    </div>

                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nom complet
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    placeholder="Jean Dupont"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    placeholder="votre@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full btn-gradient text-white font-semibold py-3 rounded-lg shadow-lg"
                        >
                            Créer mon compte
                        </button>
                    </form>

                    <div className="text-center pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Déjà un compte ?{' '}
                            <Link to="/login" className="font-semibold gradient-text hover:underline">
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
