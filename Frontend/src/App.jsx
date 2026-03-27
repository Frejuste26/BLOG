import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/posts/create" element={<CreatePost />} />
        <Route path="/posts/edit/:id" element={<EditPost />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
