import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Loader } from 'lucide-react';

export default function Feed() {
  const { posts, loading, error, fetchPosts } = useStore();

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-500">No posts yet. Be the first to post!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <article key={post.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
          <h2 className="text-2xl font-bold mb-3">{post.communityName}</h2>
          <p className="text-gray-700 mb-4 text-xl font-bold">{post.title}</p>
          <p className="text-gray-700 mb-4">{post.content}</p>
          <div className="mt-2 pt-2  border-gray-200 text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </article>
      ))}
    </div>
  );
}