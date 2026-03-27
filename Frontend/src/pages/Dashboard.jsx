import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PlusCircle, LogOut, Edit2, Trash2, BookOpen, TrendingUp, User as UserIcon, Eye } from 'lucide-react';

export default function Dashboard() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { logout, user } = useAuth();
    const { success, error } = useToast();

    const fetchPosts = useCallback(async () => {
        try {
            const response = await api.get('/posts');
            setPosts(Array.isArray(response.data) ? response.data : response.data.data || []);
        } catch {
            error('Erreur lors du chargement des articles');
        } finally {
            setLoading(false);
        }
    }, [error]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const deletePost = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;
        try {
            await api.delete(`/posts/${id}`);
            setPosts(posts.filter(post => post.id !== id));
            success('Article supprimé avec succès !');
        } catch {
            error('Échec de la suppression');
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4"></div>
                    <div className="text-white text-xl">Chargement...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 animate-fadeInDown">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <BookOpen className="w-8 h-8 text-white animate-pulse-slow" />
                            <h1 className="text-2xl font-bold text-white">Mon Blog</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/profile"
                                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all hover:scale-105 animate-fadeInDown delay-100"
                            >
                                <UserIcon className="w-4 h-4" />
                                <span>{user?.name}</span>
                            </Link>
                            <button
                                onClick={logout}
                                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all hover:scale-105 animate-fadeInDown delay-200"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Déconnexion</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 animate-fadeInUp delay-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/70 text-sm">Total Articles</p>
                                <p className="text-3xl font-bold text-white mt-1">{posts.length}</p>
                            </div>
                            <BookOpen className="w-12 h-12 text-white/50" />
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 animate-fadeInUp delay-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/70 text-sm">Publié ce mois</p>
                                <p className="text-3xl font-bold text-white mt-1">{posts.length}</p>
                            </div>
                            <TrendingUp className="w-12 h-12 text-white/50" />
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 animate-fadeInUp delay-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/70 text-sm">Brouillons</p>
                                <p className="text-3xl font-bold text-white mt-1">0</p>
                            </div>
                            <Edit2 className="w-12 h-12 text-white/50" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-8 animate-fadeInUp delay-400">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Mes Articles</h2>
                        <p className="text-white/70">Gérez vos publications</p>
                    </div>
                    <Link
                        to="/posts/create"
                        className="flex items-center space-x-2 px-6 py-3 btn-gradient btn-ripple text-white font-semibold rounded-lg shadow-lg"
                    >
                        <PlusCircle className="w-5 h-5" />
                        <span>Nouvel Article</span>
                    </Link>
                </div>

                {/* Posts Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post, index) => (
                        <div
                            key={post.id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden card-hover animate-fadeInUp"
                            style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                        >
                            <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
                            <div className="p-6">
                                <h3 className="mb-3 text-xl font-bold text-gray-800 line-clamp-2">
                                    {post.titre}
                                </h3>
                                <p className="mb-4 text-gray-600 line-clamp-3">
                                    {post.description}
                                </p>
                            </div>

                            <div className="flex justify-between px-6 pb-6">
                                <Link
                                    to={`/posts/${post.id}`}
                                    className="flex items-center space-x-1 px-4 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg transition-all hover:scale-105 font-medium"
                                >
                                    <Eye className="w-4 h-4" />
                                    <span>Voir</span>
                                </Link>
                                <div className="flex space-x-2">
                                    <Link
                                        to={`/posts/edit/${post.id}`}
                                        className="flex items-center space-x-1 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all hover:scale-105 font-medium"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={() => deletePost(post.id)}
                                        className="flex items-center space-x-1 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all hover:scale-105 font-medium"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {posts.length === 0 && (
                        <div className="col-span-full py-16 text-center bg-white/10 backdrop-blur-sm rounded-xl border-2 border-dashed border-white/30 animate-scaleIn">
                            <BookOpen className="w-16 h-16 mx-auto mb-4 text-white/50 animate-pulse-slow" />
                            <p className="text-white/70 text-lg">Aucun article trouvé</p>
                            <p className="text-white/50 mt-2">Créez votre premier article !</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
