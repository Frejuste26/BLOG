import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { Save, X, Edit3 } from 'lucide-react';

export default function EditPost() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();
    const { success, error } = useToast();

    const fetchPost = useCallback(async () => {
        try {
            const response = await api.get(`/posts/${id}`);
            const post = response.data.data || response.data;

            if (post) {
                setTitle(post.titre);
                setDescription(post.description);
            } else {
                error('Article non trouvé');
                navigate('/');
            }
        } catch {
            error('Erreur lors du chargement');
            navigate('/');
        } finally {
            setLoading(false);
        }
    }, [error, id, navigate]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`/posts/${id}`, { titre: title, description });
            success('Article mis à jour avec succès !');
            navigate('/');
        } catch {
            error('Échec de la mise à jour');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white text-xl">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition">
                        <X className="w-5 h-5 mr-2" />
                        Retour au dashboard
                    </Link>
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                            <Edit3 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white">Modifier l'Article</h2>
                            <p className="text-white/70">Mettez à jour votre publication</p>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Titre de l'article
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg"
                                placeholder="Un titre accrocheur..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Contenu
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="12"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
                                placeholder="Écrivez votre article ici..."
                                required
                            ></textarea>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <Link
                                to="/"
                                className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
                            >
                                Annuler
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center space-x-2 px-6 py-3 btn-gradient text-white font-semibold rounded-lg shadow-lg disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                <span>{loading ? 'Mise à jour...' : 'Enregistrer les modifications'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
