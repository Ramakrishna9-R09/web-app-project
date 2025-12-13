import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Users, Bookmark, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Sidebar() {
  const communities = useStore((state) => state.communities);
  const fetchCommunities = useStore((state) => state.fetchCommunities);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  const handleCommunityClick = (communityId: string) => {
    navigate(`/community/${communityId}`);
  };

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <nav className="space-y-1">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <Link
            to="/communities"
            className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <Users className="w-5 h-5" />
            <span>Communities</span>
          </Link>
          {/* <Link
            to="/saved"
            className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <Bookmark className="w-5 h-5" />
            <span>Saved</span>
          </Link>
          <Link
            to="/settings"
            className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link> */}
        </nav>

        <div className="mt-8">
          <h3 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
            My Communities
          </h3>
          <div className="mt-4 space-y-1">
            {communities.map((community) => (
              <Link
                key={community.id}
                to={`/community/${community.id}`}
                className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <img
                  src={community.avatar}
                  alt={community.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="truncate">{community.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}