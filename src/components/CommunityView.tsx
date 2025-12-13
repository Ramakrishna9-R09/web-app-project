import React from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Users, Info } from 'lucide-react';
import PostForm from './PostForm';
import PostList from './PostList';

export default function CommunityView() {
  const { id } = useParams();
  const { communities, currentUser, joinCommunity } = useStore();
  const community = communities.find(c => c.id === id);

  if (!community) {
    return <div>Community not found</div>;
  }

  const isMember = community.members.includes(currentUser?.id || '');

  const handleJoinCommunity = () => {
    if (currentUser) {
      joinCommunity(community.id, currentUser.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <div className="p-6 -mt-12">
          <div className="flex justify-between items-start">
            <div className="flex items-end space-x-4">
              <img
                src={community.avatar}
                alt={community.name}
                className="w-24 h-24 rounded-full border-4 border-white"
              />
              <div>
                <h1 className="text-2xl font-bold">{community.name}</h1>
                <p className="text-gray-600">{community.description}</p>
              </div>
            </div>
            {!isMember && (
              <button
                onClick={handleJoinCommunity}
                className="px-4 py-2 mt-20 mr-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Join Community
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              {community.members.length} members
            </div>
            <div className="flex items-center">
              <Info className="w-5 h-5 mr-2" />
              {community.category}
            </div>
          </div>
        </div>
      </div>

      {isMember && <PostForm communityId={community.id} />}
      <PostList communityId={community.id} />
    </div>
  );
}