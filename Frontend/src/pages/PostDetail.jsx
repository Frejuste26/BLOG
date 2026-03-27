import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Calendar, Edit2, Trash2, User } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { success, error } = useToast();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchPost = useCallback(async () => {
        try {
            const response = await api.get(`/posts/${id}`);
            const foundPost = response.data.data || response.data;

            if (foundPost) {
                setPost(foundPost);
            } else {
                error('Article non trouvé');
                navigate('/');
            }
        } catch {
            error('Erreur lors du chargement de l\'article');
            navigate('/');
        } finally {
            setLoading(false);
        }
    }, [error, id, navigate]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    const handleDelete = async () => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

        try {
            await api.delete(`/posts/${id}`);
            success('Article supprimé avec succès !');
            navigate('/');
        } catch {
            error('Erreur lors de la suppression');
        }
    };

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

    if (!post) return null;

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 animate-fadeInDown">
                    <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Retour aux articles
                    </Link>
                </div>

                {/* Article Card */}
                <article className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
                    {/* Header coloré */}
                    <div className="h-3 bg-gradient-to-r from-purple-500 to-indigo-600"></div>

                    <div className="p-8 md:p-12">
                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            {post.titre}
                        </h1>

                        {/* Meta info */}
                        <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-gray-200">
                            <div className="flex items-center text-gray-600">
                                <User className="w-5 h-5 mr-2" />
                                <span>Auteur</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Calendar className="w-5 h-5 mr-2" />
                                <span>Aujourd'hui</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="prose prose-lg max-w-none mb-8">
                            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                                {post.description}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-3 pt-8 border-t border-gray-200">
                            <Link
                                to={`/posts/edit/${post.id}`}
                                className="flex items-center space-x-2 px-6 py-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all hover:scale-105 font-medium"
                            >
                                <Edit2 className="w-5 h-5" />
                                <span>Modifier</span>
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="flex items-center space-x-2 px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all hover:scale-105 font-medium"
                            >
                                <Trash2 className="w-5 h-5" />
                                <span>Supprimer</span>
                            </button>
                        </div>
                    </div>
                </article>

                {/* Related articles suggestion */}
                <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 animate-fadeInUp delay-200">
                    <h3 className="text-xl font-bold text-white mb-2">Articles similaires</h3>
                    <p className="text-white/70">Fonctionnalité à venir...</p>
                </div>
            </div>
        </div>
    );
}
