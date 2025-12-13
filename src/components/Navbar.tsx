import { Link, useNavigate } from 'react-router-dom';
import { Bell, MessageCircle, Search, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';

export default function Navbar() {
  const { currentUser, searchContent } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchContent(query);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold">VIT Connect</span>
          </Link>

          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search communities, posts, or people..."
                className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border p-2 max-h-96 overflow-y-auto z-50">
                  <SearchResults query={searchQuery} />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Bell className="w-6 h-6 text-gray-600" />
            </button>
            <Link to="/profile" className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium">{currentUser?.name}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 p-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function SearchResults({ query }: { query: string }) {
  const { searchResults } = useStore();
  const navigate = useNavigate();

  if (!searchResults || Object.values(searchResults).every(arr => arr.length === 0)) {
    return <div className="text-gray-500 p-2">No results found</div>;
  }

  return (
    <div className="space-y-4">
      {searchResults.communities.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Communities</h3>
          {searchResults.communities.map(community => (
            <div
              key={community.id}
              onClick={() => navigate(`/community/${community.id}`)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <img src={community.avatar} alt={community.name} className="w-8 h-8 rounded-full" />
              <span>{community.name}</span>
            </div>
          ))}
        </div>
      )}

      {searchResults.posts.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-2">Posts</h3>
          {searchResults.posts.map(post => (
            <div
              key={post.id}
              onClick={() => navigate(`/community/${post.communityId}`)}
              className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <h4 className="font-medium">{post.title}</h4>
              <p className="text-sm text-gray-500 truncate">{post.content}</p>
            </div>
          ))}
        </div>
      )}

      {searchResults.users.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-2">People</h3>
          {searchResults.users.map(user => (
            <div
              key={user.id}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
              <div>
                <span className="font-medium">{user.name}</span>
                <p className="text-sm text-gray-500">{user.department}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}