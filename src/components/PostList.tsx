import React, { useEffect, useRef, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { ThumbsUp, MessageCircle, Share2, Loader } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function PostList({ communityId }: { communityId?: string }) {
  const { posts, communities, currentUser, likePost, hasMore, loading, loadMorePosts } = useStore();
  
  const filteredPosts = communityId 
    ? posts.filter(post => post.communityId === communityId)
    : posts;
  
  const observer = useRef<IntersectionObserver>();
  const lastPostRef = useCallback((node: HTMLElement | null) => {
    if (loading) return;
    
    if (observer.current) {
      observer.current.disconnect();
    }
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMorePosts();
      }
    });
    
    if (node) {
      observer.current.observe(node);
    }
  }, [loading, hasMore]);

  return (
    <div className="space-y-6">
      {filteredPosts.map((post, index) => {
        const community = communities.find(c => c.id === post.communityId);
        const isLastPost = index === posts.length - 1;
        
        return (
          <article 
            key={post.id} 
            ref={isLastPost ? lastPostRef : null}
            className="bg-white rounded-lg shadow-sm"
          >
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={community?.avatar}
                  alt={community?.name}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{community?.name}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(post.createdAt))} ago
                  </p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-700">{post.content}</p>

              <div className="flex items-center space-x-4 mt-4 pt-4 border-t">
                <button 
                  onClick={() => likePost(post.id)}
                  className="flex items-center space-x-2 text-gray-500 hover:text-blue-600"
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600">
                  <MessageCircle className="w-5 h-5" />
                  <span>{post.comments.length}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>

              {post.comments.length > 0 && (
                <div className="mt-4 pt-4 border-t space-y-3">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <img
                        src={currentUser?.avatar}
                        alt={currentUser?.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <div className="flex-1 bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700">{comment.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(comment.createdAt))} ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </article>
        );
      })}
      
      {loading && (
        <div className="flex justify-center p-4">
          <Loader className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      )}
      
      {!hasMore && posts.length > 0 && (
        <div className="text-center text-gray-500 p-4">
          No more posts to load
        </div>
      )}
    </div>
  );
}