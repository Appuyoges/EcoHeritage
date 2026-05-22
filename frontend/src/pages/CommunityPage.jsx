import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
    Users,
    MessageCircle,
    Heart,
    Share2,
    MapPin,
    Leaf,
    Image as ImageIcon,
    Send,
    Trophy,
    Star,
    TrendingUp,
    Trash2
} from 'lucide-react';

const CommunityPage = () => {
    const queryClient = useQueryClient();
    // MOCK USERS (Matching Seed)
    const MOCK_USERS = [
        { id: "user_123", name: "Yogeswaran S", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
        { id: "user_456", name: "Alice Green", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" },
        { id: "user_789", name: "Bob Trekker", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" }
    ];

    const [activeUser, setActiveUser] = useState(MOCK_USERS[0]);
    const [activeTab, setActiveTab] = useState('feed');
    const [newPostContent, setNewPostContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    // 1. Fetch Posts with React Query
    const { data: postsData, isLoading: loadingPosts } = useQuery({
        queryKey: ['community-posts', activeTab],
        queryFn: async () => {
            const sortParam = activeTab === 'trending' ? 'trending' : 'latest';
            const response = await fetch(`http://localhost:8000/api/community/posts?sort_by=${sortParam}`);
            if (!response.ok) throw new Error('Failed to fetch posts');
            return response.json();
        }
    });
    const posts = postsData?.posts || [];

    // 2. Fetch Leaderboard
    const { data: lbData } = useQuery({
        queryKey: ['global-leaderboard'],
        queryFn: async () => {
            const response = await fetch('http://localhost:8000/api/users/leaderboard');
            if (!response.ok) throw new Error('Failed to fetch leaderboard');
            return response.json();
        }
    });
    const leaderboard = lbData?.leaderboard || [];

    // 3. Post Creation Mutation
    const postMutation = useMutation({
        mutationFn: async ({ newPost, userId }) => {
            const response = await fetch('http://localhost:8000/api/community/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': userId
                },
                body: JSON.stringify(newPost)
            });
            if (!response.ok) throw new Error('Failed to create post');
            return response.json();
        },
        onSuccess: () => {
            setNewPostContent('');
            setIsPosting(false);
            queryClient.invalidateQueries(['community-posts']);
            alert(`Posted as ${activeUser.name}! earned +50 Green Points! 🌱`);
        },
        onError: () => {
            setIsPosting(false);
            alert('Failed to share your story. Please try again.');
        }
    });

    // 4. Like Mutation
    const likeMutation = useMutation({
        mutationFn: async ({ postId, userId }) => {
            await fetch(`http://localhost:8000/api/community/posts/${postId}/like`, {
                method: 'POST',
                headers: { 'x-user-id': userId }
            });
        },
        onSuccess: () => queryClient.invalidateQueries(['community-posts'])
    });

    // 5. Comment Mutation
    const commentMutation = useMutation({
        mutationFn: async ({ postId, content, userId }) => {
            await fetch(`http://localhost:8000/api/community/posts/${postId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': userId
                },
                body: JSON.stringify({ content })
            });
        },
        onSuccess: () => queryClient.invalidateQueries(['community-posts'])
    });

    // 6. Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async ({ postId, userId }) => {
            const response = await fetch(`http://localhost:8000/api/community/posts/${postId}`, {
                method: 'DELETE',
                headers: { 'x-user-id': userId }
            });
            if (!response.ok) throw new Error('Failed to delete post');
        },
        onSuccess: () => queryClient.invalidateQueries(['community-posts']),
        onError: () => alert('Could not delete post (Are you the author?)')
    });

    const handleCreatePost = () => {
        if (!newPostContent.trim()) return;
        setIsPosting(true);
        postMutation.mutate({
            newPost: { content: newPostContent, tags: ['EcoTraveling', 'RealTime'] },
            userId: activeUser.id
        });
    };

    const handleLike = (id) => likeMutation.mutate({ postId: id, userId: activeUser.id });
    const handleComment = (postId) => {
        const content = prompt(`Comment as ${activeUser.name}:`);
        if (content) commentMutation.mutate({ postId, content, userId: activeUser.id });
    };
    const handleDelete = (postId) => {
        if (confirm("Are you sure you want to delete this post?")) {
            deleteMutation.mutate({ postId, userId: activeUser.id });
        }
    };

    // FILTER LOGIC
    const [viewedUserId, setViewedUserId] = useState(null);

    // Filter posts if a user is selected
    const displayedPosts = viewedUserId
        ? posts.filter(p => p.user.id === viewedUserId || (p.user.name === MOCK_USERS.find(u => u.id === viewedUserId)?.name))
        : posts;

    const handleUserClick = (userId) => {
        if (viewedUserId === userId) setViewedUserId(null); // Toggle off
        else setViewedUserId(userId);
    };

    const containerStyle = {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 40px'
    };

    return (
        <div style={{ minHeight: '100vh', background: '#09090b', paddingTop: '100px', paddingBottom: '60px' }}>
            <div style={containerStyle}>

                {/* Header with User Switcher */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '40px', position: 'relative' }}
                >
                    <div style={{ position: 'absolute', right: 0, top: 0, display: 'flex', alignItems: 'center', gap: '8px', background: '#18181b', padding: '8px 16px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <img src={activeUser.avatar} alt="Active" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                        <select
                            value={activeUser.id}
                            onChange={(e) => setActiveUser(MOCK_USERS.find(u => u.id === e.target.value))}
                            style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '14px', outline: 'none', cursor: 'pointer' }}
                        >
                            {MOCK_USERS.map(u => (
                                <option key={u.id} value={u.id} style={{ color: 'black' }}>{u.name}</option>
                            ))}
                        </select>
                    </div>

                    <span className="badge badge-eco" style={{ marginBottom: '16px' }}>
                        <Users style={{ width: '12px', height: '12px' }} />
                        Community
                    </span>
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '800', marginBottom: '12px' }}>
                        <span style={{ color: 'white' }}>Traveler </span>
                        <span className="gradient-text">Stories</span>
                    </h1>

                    {/* Filter Status Badge */}
                    {viewedUserId && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.2)', padding: '8px 16px', borderRadius: '100px', marginTop: '16px', cursor: 'pointer' }}
                            onClick={() => setViewedUserId(null)}
                        >
                            <span style={{ color: '#10b981', fontWeight: '600' }}>
                                Viewing {MOCK_USERS.find(u => u.id === viewedUserId)?.name || "User"}'s Posts
                            </span>
                            <span style={{ color: '#10b981', fontSize: '12px' }}>✕ Clear</span>
                        </motion.div>
                    )}

                    {!viewedUserId && (
                        <p style={{ fontSize: '1.125rem', color: '#9ca3af' }}>
                            Connect with eco-conscious travelers worldwide.
                        </p>
                    )}
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>

                    {/* Main Feed */}
                    <div style={{ flex: 2, minWidth: '60%' }}>

                        {/* Feed Tabs (Hide if filtering user) */}
                        {!viewedUserId && (
                            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                {['feed', 'trending'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            padding: '0 0 16px 0',
                                            color: activeTab === tab ? '#10b981' : '#9ca3af',
                                            fontWeight: activeTab === tab ? '600' : '400',
                                            borderBottom: activeTab === tab ? '2px solid #10b981' : '2px solid transparent',
                                            cursor: 'pointer',
                                            fontSize: '1.125rem',
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        {tab === 'feed' ? 'Latest Stories' : 'Trending Now'}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Create Post (Hide if filtering user) */}
                        {!viewedUserId && (
                            <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
                                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#27272a', overflow: 'hidden' }}>
                                        <img src={activeUser.avatar} alt="You" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <textarea
                                        placeholder={`Share your eco-travel experience, ${activeUser.name.split(' ')[0]}...`}
                                        value={newPostContent}
                                        onChange={(e) => setNewPostContent(e.target.value)}
                                        style={{
                                            flex: 1,
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'white',
                                            fontSize: '16px',
                                            resize: 'none',
                                            outline: 'none',
                                            minHeight: '80px'
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <button
                                            onClick={() => {
                                                const url = prompt("Enter Image URL (e.g., from Unsplash):");
                                                if (url) setNewPostContent(prev => prev + `\n![Image](${url})`);
                                            }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                                            onMouseEnter={(e) => e.target.style.color = '#10b981'}
                                            onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                                        >
                                            <ImageIcon style={{ width: '20px', height: '20px' }} />
                                            <span style={{ fontSize: '14px' }}>Photo</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                const loc = prompt("Where are you? (e.g., Kyoto, Japan):");
                                                if (loc) setNewPostContent(prev => `📍 ${loc}\n` + prev);
                                            }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                                            onMouseEnter={(e) => e.target.style.color = '#10b981'}
                                            onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                                        >
                                            <MapPin style={{ width: '20px', height: '20px' }} />
                                            <span style={{ fontSize: '14px' }}>Location</span>
                                        </button>
                                    </div>
                                    <button
                                        className="btn-primary"
                                        onClick={handleCreatePost}
                                        disabled={!newPostContent.trim() || isPosting}
                                        style={{ padding: '8px 24px', opacity: newPostContent.trim() && !isPosting ? 1 : 0.5 }}
                                    >
                                        {isPosting ? 'Posting...' : 'Post'} <Send style={{ width: '16px', height: '16px' }} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Posts Feed */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {displayedPosts.length === 0 && (
                                <div style={{ textAlign: 'center', color: '#71717a', padding: '40px' }}>
                                    No posts found for this traveler yet.
                                </div>
                            )}
                            {displayedPosts.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-card"
                                    style={{ padding: '24px' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'flex-start' }}>
                                        <div
                                            style={{ display: 'flex', gap: '12px', cursor: 'pointer' }}
                                            onClick={() => handleUserClick(post.user.id || MOCK_USERS.find(u => u.name === post.user.name)?.id)}
                                            title="Click to view profile"
                                        >
                                            <img
                                                src={post.user.avatar}
                                                alt={post.user.name}
                                                onError={(e) => { e.target.src = 'https://i.pravatar.cc/150?u=' + post.id }}
                                                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: viewedUserId === post.user.id ? '2px solid #10b981' : 'none' }}
                                            />
                                            <div>
                                                <div style={{ fontWeight: '600', color: 'white' }}>{post.user.name}</div>
                                                <div style={{ fontSize: '12px', color: '#10b981' }}>{post.user.level || 'Eco Explorer'}</div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ fontSize: '12px', color: '#71717a' }}>{post.time}</div>
                                            {(post.user.id === activeUser.id) && (
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.6, transition: 'all 0.2s' }}
                                                    title="Delete Post"
                                                    onMouseEnter={(e) => e.target.style.opacity = 1}
                                                    onMouseLeave={(e) => e.target.style.opacity = 0.6}
                                                >
                                                    <Trash2 style={{ width: '16px', height: '16px' }} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <p style={{ color: '#e4e4e7', marginBottom: '16px', lineHeight: '1.6' }}>{post.content}</p>

                                    {post.image && (
                                        <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
                                            <img src={post.image} alt="Post" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                        {post.tags.map(tag => (
                                            <span key={tag} style={{ fontSize: '12px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '100px' }}>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                        <button
                                            onClick={() => handleLike(post.id)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                                            onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                                            onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                                        >
                                            <Heart style={{ width: '20px', height: '20px' }} />
                                            {post.likes}
                                        </button>
                                        <button
                                            onClick={() => handleComment(post.id)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                        >
                                            <MessageCircle style={{ width: '20px', height: '20px' }} />
                                            {post.comments_count}
                                        </button>
                                        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                                            <Share2 style={{ width: '20px', height: '20px' }} />
                                            Share
                                        </button>
                                    </div>

                                    {/* Comments Preview */}
                                    {post.comments && post.comments.length > 0 && (
                                        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                            {post.comments.map((c, i) => (
                                                <div key={i} style={{ fontSize: '13px', color: '#e4e4e7', marginBottom: '4px' }}>
                                                    <span style={{ fontWeight: '600', color: '#10b981' }}>{c.user.name}: </span>
                                                    {c.content}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        {/* Leaderboard */}
                        <div className="glass-card" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                                <Trophy style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white' }}>Top Travelers</h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {leaderboard.map((user, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', background: user.is_current_user ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.03)', border: user.is_current_user ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent' }}>
                                        <div style={{ width: '24px', fontWeight: '700', color: index < 3 ? '#f59e0b' : '#71717a', textAlign: 'center' }}>{user.rank}</div>
                                        <img src={user.avatar} alt={user.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '600', color: 'white', fontSize: '14px' }}>{user.name}</div>
                                            <div style={{ fontSize: '12px', color: '#9ca3af' }}>{user.is_current_user ? 'Eco Explorer' : 'Heritage Hunter'}</div>
                                        </div>
                                        <div style={{ fontWeight: '700', color: '#10b981', fontSize: '14px' }}>{user.points}</div>
                                    </div>
                                ))}
                            </div>

                            <button className="btn-secondary" style={{ width: '100%', marginTop: '24px', justifyContent: 'center' }}>
                                View Full Leaderboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;
