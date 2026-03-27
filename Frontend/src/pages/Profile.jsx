import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { User, Mail, Lock, Save, ArrowLeft, Shield } from 'lucide-react';

export default function Profile() {
    const { user, refreshUser } = useAuth();
    const { success, error } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    useEffect(() => {
        setName(user?.name || '');
        setEmail(user?.email || '');
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsSavingProfile(true);
        try {
            const response = await api.put('/user/profile', { name, email });
            await refreshUser();
            success(response.data.message || 'Profil mis a jour avec succes');
            setIsEditing(false);
        } catch (e) {
            error(e.response?.data?.message || 'Echec de la mise a jour du profil');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            error('Les mots de passe ne correspondent pas');
            return;
        }
        if (newPassword.length < 6) {
            error('Le mot de passe doit contenir au moins 6 caracteres');
            return;
        }

        setIsSavingPassword(true);
        try {
            const response = await api.put('/user/password', {
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: confirmPassword,
            });

            success(response.data.message || 'Mot de passe mis a jour avec succes');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (e) {
            error(e.response?.data?.message || 'Echec de la mise a jour du mot de passe');
        } finally {
            setIsSavingPassword(false);
        }
    };

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 animate-fadeInDown">
                    <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Retour au dashboard
                    </Link>
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white">Mon Profil</h2>
                            <p className="text-white/70">Gerez vos informations personnelles</p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fadeInUp delay-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Informations personnelles</h3>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                {isEditing ? 'Annuler' : 'Modifier'}
                            </button>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-4">
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
                                        disabled={!isEditing || isSavingProfile}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-500"
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
                                        disabled={!isEditing || isSavingProfile}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-500"
                                    />
                                </div>
                            </div>

                            {isEditing && (
                                <button
                                    type="submit"
                                    disabled={isSavingProfile}
                                    className="w-full flex items-center justify-center space-x-2 btn-gradient text-white font-semibold py-3 rounded-lg shadow-lg disabled:opacity-50"
                                >
                                    <Save className="w-5 h-5" />
                                    <span>{isSavingProfile ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
                                </button>
                            )}
                        </form>
                    </div>

                    <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fadeInUp delay-200">
                        <div className="flex items-center space-x-2 mb-6">
                            <Shield className="w-6 h-6 text-indigo-600" />
                            <h3 className="text-xl font-bold text-gray-800">Securite</h3>
                        </div>

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mot de passe actuel
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        disabled={isSavingPassword}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                        placeholder="********"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nouveau mot de passe
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        disabled={isSavingPassword}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                        placeholder="********"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirmer le mot de passe
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={isSavingPassword}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                        placeholder="********"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSavingPassword}
                                className="w-full flex items-center justify-center space-x-2 btn-gradient text-white font-semibold py-3 rounded-lg shadow-lg disabled:opacity-50"
                            >
                                <Shield className="w-5 h-5" />
                                <span>{isSavingPassword ? 'Mise a jour...' : 'Changer le mot de passe'}</span>
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 animate-fadeInUp delay-300">
                    <h3 className="text-xl font-bold text-white mb-4">Statistiques du compte</h3>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">0</p>
                            <p className="text-white/70 text-sm mt-1">Articles publies</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">0</p>
                            <p className="text-white/70 text-sm mt-1">Vues totales</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">0</p>
                            <p className="text-white/70 text-sm mt-1">Commentaires</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}