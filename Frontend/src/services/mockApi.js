// Mock API for testing frontend without backend
let mockPosts = [
    { id: 1, titre: 'Premier Article', description: 'Ceci est le contenu du premier article de démonstration.', user_id: 1 },
    { id: 2, titre: 'Deuxième Article', description: 'Un autre article intéressant pour tester notre interface.', user_id: 1 },
    { id: 3, titre: 'Guide React', description: 'Apprendre React avec des exemples pratiques et concrets.', user_id: 1 },
];

let mockUser = {
    id: 1,
    name: 'Utilisateur Test',
    email: 'test@example.com',
};

let mockToken = 'mock-token-12345';
let nextId = 4;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockApi = {
    post: async (url, data) => {
        await delay(300); // Simulate network delay

        if (url === '/register') {
            mockUser = { id: 1, name: data.name, email: data.email };
            return { data: { user: mockUser, token: mockToken } };
        }

        if (url === '/login') {
            if (data.email === 'test@example.com' && data.password === 'password') {
                return { data: { user: mockUser, token: mockToken } };
            }
            throw new Error('Invalid credentials');
        }

        if (url === '/logout') {
            return { data: { message: 'Logged out' } };
        }

        if (url === '/posts/create') {
            const newPost = { id: nextId++, ...data, user_id: mockUser.id };
            mockPosts.push(newPost);
            return { data: newPost };
        }

        throw new Error('Unknown endpoint');
    },

    get: async (url) => {
        await delay(300);

        if (url === '/user') {
            return { data: mockUser };
        }

        if (url === '/posts') {
            return { data: mockPosts };
        }

        throw new Error('Unknown endpoint');
    },

    put: async (url, data) => {
        await delay(300);

        const match = url.match(/\/posts\/edit\/(\d+)/);
        if (match) {
            const id = parseInt(match[1]);
            const index = mockPosts.findIndex(p => p.id === id);
            if (index !== -1) {
                mockPosts[index] = { ...mockPosts[index], ...data };
                return { data: mockPosts[index] };
            }
        }

        throw new Error('Post not found');
    },

    delete: async (url) => {
        await delay(300);

        const match = url.match(/\/posts\/(\d+)/);
        if (match) {
            const id = parseInt(match[1]);
            mockPosts = mockPosts.filter(p => p.id !== id);
            return { data: { message: 'Deleted' } };
        }

        throw new Error('Post not found');
    },
};

export default mockApi;
