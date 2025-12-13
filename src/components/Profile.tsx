import React, { useState } from 'react';
import { User as UserIcon, Linkedin, Github, FileText, Edit2, Save, Plus, Loader } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Profile() {
  const { currentUser, communities, updateUserProfile } = useStore();
  const userCommunities = communities.filter(c => c.members.includes(currentUser?.id || ''));
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({
    name: currentUser?.name || '',
    department: currentUser?.department || '',
    bio: currentUser?.bio || '',
    linkedin: currentUser?.socialLinks?.linkedin || '',
    github: currentUser?.socialLinks?.github || '',
    resumeUrl: currentUser?.resumeUrl || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const updatedUser = {
        ...currentUser!,
        name: profile.name,
        department: profile.department,
        bio: profile.bio,
        socialLinks: {
          linkedin: profile.linkedin,
          github: profile.github
        },
        resumeUrl: profile.resumeUrl
      };

      await updateUserProfile(updatedUser);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <div className="p-6 -mt-12">
          <div className="flex justify-between items-start">
            <div className="flex items-end space-x-4">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-24 h-24 rounded-full border-4 border-white"
              />
              <div>
                <h1 className=" mt-8 text-2xl font-bold">{currentUser?.name}</h1>
                <p className="text-gray-600">{currentUser?.department}</p>
              </div>
            </div>
            <button
              onClick={() => !loading && (isEditing ? handleSubmit : setIsEditing(true))}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <select
                    value={profile.department}
                    onChange={e => setProfile({ ...profile, department: e.target.value })}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Chemical">Chemical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={e => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Linkedin className="w-5 h-5 text-blue-600" />
                  <input
                    type="url"
                    placeholder="LinkedIn Profile URL"
                    value={profile.linkedin}
                    onChange={e => setProfile({ ...profile, linkedin: e.target.value })}
                    className="flex-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Github className="w-5 h-5" />
                  <input
                    type="url"
                    placeholder="GitHub Profile URL"
                    value={profile.github}
                    onChange={e => setProfile({ ...profile, github: e.target.value })}
                    className="flex-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </form>
          ) : (
            <div className="mt-6 space-y-6">
              <p className="text-gray-600">{currentUser?.bio || 'No bio added yet'}</p>
              
              <div className="flex space-x-4">
                {currentUser?.socialLinks?.linkedin && (
                  <a
                    href={currentUser.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {currentUser?.socialLinks?.github && (
                  <a
                    href={currentUser.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                  >
                    <Github className="w-5 h-5" />
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">My Communities</h2>
        <div className="grid grid-cols-2 gap-4">
          {userCommunities.map(community => (
            <div key={community.id} className="flex items-center space-x-3 p-3 rounded-lg border">
              <img
                src={community.avatar}
                alt={community.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-medium">{community.name}</h3>
                <p className="text-sm text-gray-500">{community.members.length} members</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}