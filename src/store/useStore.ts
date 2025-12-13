import { create } from 'zustand';
import { collection, getDocs, query, orderBy, limit, addDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { User, Post, Community } from '../types';

interface Store {
  currentUser: User | null;
  posts: Post[];
  communities: Community[];
  loading: boolean;
  error: string | null;
  setCurrentUser: (user: User | null) => void;
  updateUserProfile: (user: User) => Promise<void>;
  fetchPosts: () => Promise<void>;
  addPost: (post: Omit<Post, 'id'>) => Promise<void>;
  fetchCommunities: () => Promise<void>;
  addCommunity: (community: Omit<Community, 'id'>) => Promise<void>;
}

const searchContent = (query: string) => {
  const { posts, communities, users, setSearchResults } = get(); // Accessing posts and setSearchResults from the store's state
  const filteredResults = {
    communities: communities.filter(community => community.name.toLowerCase().includes(query.toLowerCase())),
    posts: posts.filter(post => post.title.toLowerCase().includes(query.toLowerCase())),
    users: users.filter(user => user.name.toLowerCase().includes(query.toLowerCase())),
  };
  setSearchResults(filteredResults); // Ensure setSearchResults is defined in the store
};

export const useStore = create<Store>((set, get) => ({
  currentUser: null,
  posts: [],
  communities: [],
  loading: false,
  error: null,

  setCurrentUser: (user) => set({ currentUser: user }),

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
      set({ communities });
    } catch (error) {
      console.error('Error fetching communities:', error);
      throw new Error('Failed to fetch communities');
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
      
      set({ posts, loading: false });
    } catch (error) {
      console.error('Error fetching posts:', error);
      set({ error: 'Failed to fetch posts', loading: false });
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
  }
}));