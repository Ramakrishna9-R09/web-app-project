export interface User {
    id: string;
    name: string;
    avatar: string;
    role: 'student' | 'faculty' | 'admin';
    department: string;
    bio?: string;
    socialLinks?: {
      linkedin?: string;
      github?: string;
    };
    resumeUrl?: string;
  }
  
  export interface Post {
    id: string;
    title: string;
    content: string | File;
    authorId: string;
    communityId: string;
    communityName: string;
    createdAt: string;
    updatedAt: string;
    likes: number;
    comments: Comment[];
  }
  
  export interface Comment {
    id: string;
    content: string;
    authorId: string;
    postId: string;
    createdAt: string;
  }
  
  export interface Community {
    id: string;
    name: string;
    description: string;
    category: string;
    members: string[];
    avatar: string;
  }

  export interface Store {
    currentUser: User | null;
    posts: Post[];
    communities: Community[];
    loading: boolean;
    error: string | null;
    setCurrentUser: (user: User | null) => void;
    fetchPosts: () => Promise<void>;
    addCommunity: (community: Community) => Promise<void>;
    addPost: (post: Post) => Promise<void>;
    joinCommunity: (communityId: string, userId: string) => void;
  } 