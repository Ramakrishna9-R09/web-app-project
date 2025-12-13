import { Community, Post } from '../types';

export const initialCommunities: Community[] = [
  {
    id: 'comp-sci',
    name: 'Computer Science',
    description: 'A community for Computer Science students and faculty to discuss coursework, research, and technology.',
    category: 'Academic',
    members: ['1'],
    avatar: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400'
  },
  {
    id: 'campus-life',
    name: 'Campus Life',
    description: 'Discuss everything about campus life, events, and activities at VIT.',
    category: 'General',
    members: ['1'],
    avatar: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400'
  },
  {
    id: 'research-hub',
    name: 'Research Hub',
    description: 'Connect with researchers, share papers, and discuss ongoing research projects.',
    category: 'Research',
    members: ['1'],
    avatar: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400'
  },
  {
    id: 'tech-club',
    name: 'Tech Club',
    description: 'Official community for VIT Tech Club. Share projects, organize hackathons, and collaborate.',
    category: 'Club',
    members: ['1'],
    avatar: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400'
  }
];

// Generate more sample posts for infinite scroll
export const initialPosts: Post[] = Array.from({ length: 50 }, (_, i) => ({
  id: (i + 1).toString(),
  title: `Sample Post ${i + 1}`,
  content: i < 5 ? [
    'Join us for the biggest hackathon of the year! This year\'s theme is "Technology for Social Impact". Registration opens next week.',
    'Let\'s discuss the recent paper on transformer architectures published in Nature. What are your thoughts on their approach to attention mechanisms?',
    'Don\'t miss the annual food festival featuring cuisines from around the world. Location: Central Square, Date: March 15th',
    'Looking for study partners for the upcoming Advanced Algorithms exam. We meet every Tuesday and Thursday in the library.',
    'The CS department just got new M2 Mac Studios and high-end GPUs for machine learning research. Check them out in Lab 401!'
  ][i] : `This is sample post content ${i + 1}. It contains some text to demonstrate how the infinite scroll works with multiple posts.`,
  authorId: '1',
  communityId: ['comp-sci', 'campus-life', 'research-hub', 'tech-club'][i % 4],
  createdAt: new Date(Date.now() - i * 3600 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - i * 3600 * 1000).toISOString(),
  likes: Math.floor(Math.random() * 100),
  comments: i < 1 ? [
    {
      id: 'c1',
      content: 'Can\'t wait for this! Last year\'s hackathon was amazing.',
      authorId: '1',
      postId: '1',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    }
  ] : []
}));