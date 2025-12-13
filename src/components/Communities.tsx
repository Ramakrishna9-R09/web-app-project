import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Users, Plus, Loader } from 'lucide-react';
import CreateCommunity from './CreateCommunity';
import { useNavigate } from 'react-router-dom';

export default function Communities() {
  const { communities, fetchCommunities } = useStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCommunities = async () => {
      try {
        await fetchCommunities();
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadCommunities();
  }, []);

  const handleCommunityClick = (communityId: string) => {
    navigate(`/community/${communityId}`);
  };

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Communities</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>Create Community</span>
        </button>
      </div>

      {showCreateModal && (
        <CreateCommunity onClose={() => setShowCreateModal(false)} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((community) => (
          <div
            key={community.id}
            onClick={() => handleCommunityClick(community.id)}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600" />
            <div className="p-4">
              <div className="flex items-center space-x-4 -mt-10">
                <img
                  src={community.avatar}
                  alt={community.name}
                  className="w-16 h-16 rounded-full border-4 border-white"
                />
                <div>
                  <h3 className="mt-8 font-semibold text-lg">{community.name}</h3>
                  <p className="text-sm text-gray-500">{community.category}</p>
                </div>
              </div>
              <p className="mt-4 text-gray-600 text-sm line-clamp-2">
                {community.description}
              </p>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <Users className="w-4 h-4 mr-2" />
                {community.members.length} members
              </div>
            </div>
          </div>
        ))}
      </div>

      {communities.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No communities yet</h3>
          <p className="text-gray-500">Create your first community to get started</p>
        </div>
      )}
    </div>
  );
}