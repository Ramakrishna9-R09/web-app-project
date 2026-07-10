import { create } from 'zustand';
import { collection, getDocs, query, orderBy, limit, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { User, Post, Community } from '../types';
import { initialCommunities, initialPosts } from '../data/initialData';

type SearchResults = {
  communities: Community[];
  posts: Post[];
  users: User[];
};

interface Store {
  currentUser: User | null;
  posts: Post[];
  communities: Community[];
  users: User[];
  searchResults: SearchResults;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  setCurrentUser: (user: User | null) => void;
  updateUserProfile: (user: User) => Promise<void>;
  fetchPosts: () => Promise<void>;
  addPost: (post: Omit<Post, 'id'>) => Promise<void>;
  likePost: (postId: string) => void;
  loadMorePosts: () => void;
  fetchCommunities: () => Promise<void>;
  addCommunity: (community: Omit<Community, 'id'>) => Promise<Community>;
  joinCommunity: (communityId: string, userId: string) => void;
  searchContent: (query: string) => void;
}

export const useStore = create<Store>((set, get) => ({
  currentUser: null,
  posts: [],
  communities: [],
  users: [],
  searchResults: { communities: [], posts: [], users: [] },
  hasMore: false,
  loading: false,
  error: null,

  setCurrentUser: (user) => set(state => ({
    currentUser: user,
    users: user && !state.users.some(existingUser => existingUser.id === user.id)
      ? [user, ...state.users]
      : state.users
  })),

  updateUserProfile: async (updatedUser) => {
    try {
      const userRef = doc(db, 'users', updatedUser.id);
      await updateDoc(userRef, {
        name: updatedUser.name,
        department: updatedUser.department,
        bio: updatedUser.bio,
        socialLinks: updatedUser.socialLinks
      });
      set({ currentUser: { ...get().currentUser, ...updatedUser } });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  },

  fetchCommunities: async () => {
    try {
      const communitiesQuery = query(collection(db, 'communities'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(communitiesQuery);
      const communities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Community));
      set({ communities: communities.length ? communities : initialCommunities });
    } catch (error) {
      console.error('Error fetching communities:', error);
      set({ communities: initialCommunities });
    }
  },

  addCommunity: async (community) => {
    try {
      const docRef = await addDoc(collection(db, 'communities'), {
        ...community,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      const newCommunity = { ...community, id: docRef.id } as Community;
      set(state => ({ communities: [newCommunity, ...state.communities] }));
      return newCommunity;
    } catch (error) {
      console.error('Error adding community:', error);
      throw new Error('Failed to create community');
    }
  },

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const postsQuery = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      
      const snapshot = await getDocs(postsQuery);
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Post));
      
      set({ posts: posts.length ? posts : initialPosts, loading: false });
    } catch (error) {
      console.error('Error fetching posts:', error);
      set({ posts: initialPosts, loading: false });
    }
  },

  addPost: async (post) => {
    try {
      const docRef = await addDoc(collection(db, 'posts'), post);
      const newPost = { ...post, id: docRef.id } as Post;
      set(state => ({ posts: [newPost, ...state.posts] }));
    } catch (error) {
      console.error('Error adding post:', error);
      set({ error: 'Failed to add post' });
    }
  },

  likePost: (postId) => {
    set(state => ({
      posts: state.posts.map(post =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    }));
  },

  loadMorePosts: () => {
    set({ hasMore: false });
  },

  joinCommunity: (communityId, userId) => {
    set(state => ({
      communities: state.communities.map(community =>
        community.id === communityId && !community.members.includes(userId)
          ? { ...community, members: [...community.members, userId] }
          : community
      )
    }));
  },

  searchContent: (searchQuery) => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      set({ searchResults: { communities: [], posts: [], users: [] } });
      return;
    }

    const { posts, communities, users } = get();
    set({
      searchResults: {
        communities: communities.filter(community =>
          community.name.toLowerCase().includes(normalizedQuery) ||
          community.description.toLowerCase().includes(normalizedQuery)
        ),
        posts: posts.filter(post =>
          post.title.toLowerCase().includes(normalizedQuery) ||
          post.content.toLowerCase().includes(normalizedQuery)
        ),
        users: users.filter(user =>
          user.name.toLowerCase().includes(normalizedQuery) ||
          user.department.toLowerCase().includes(normalizedQuery)
        )
      }
    });
  }
}));
