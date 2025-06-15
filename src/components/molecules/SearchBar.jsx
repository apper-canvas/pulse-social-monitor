import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '../ApperIcon';
import Avatar from '../atoms/Avatar';
import Text from '../atoms/Text';
import { userService, postService } from '@/services';

const SearchBar = ({ onResultSelect, placeholder = "Search users and posts..." }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const searchData = async () => {
      if (!query.trim()) {
        setResults({ users: [], posts: [] });
        setShowResults(false);
        return;
      }

      setLoading(true);
      try {
        const [users, posts] = await Promise.all([
          userService.searchUsers(query),
          postService.search(query)
        ]);
        
        setResults({ users, posts });
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults({ users: [], posts: [] });
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchData, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleResultClick = (result, type) => {
    if (onResultSelect) {
      onResultSelect(result, type);
    }
    setShowResults(false);
    setQuery('');
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ApperIcon name="Search" className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-surface border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          onFocus={() => query && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <ApperIcon name="Loader2" className="w-5 h-5 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      <AnimatePresence>
        {showResults && (results.users.length > 0 || results.posts.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-surface border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
          >
            {/* Users */}
            {results.users.length > 0 && (
              <div className="p-2">
                <Text variant="caption" color="muted" className="px-3 py-2">
                  Users
                </Text>
                {results.users.map((user) => (
                  <motion.button
                    key={user.id}
                    whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
                    onClick={() => handleResultClick(user, 'user')}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors"
                  >
                    <Avatar src={user.avatar} alt={user.displayName} size="sm" />
                    <div className="flex-1 min-w-0">
                      <Text variant="label" className="text-white truncate">
                        {user.displayName}
                      </Text>
                      <Text variant="caption" color="muted" className="truncate">
                        @{user.username}
                      </Text>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Posts */}
            {results.posts.length > 0 && (
              <div className="p-2 border-t border-gray-700">
                <Text variant="caption" color="muted" className="px-3 py-2">
                  Posts
                </Text>
                {results.posts.slice(0, 5).map((post) => (
                  <motion.button
                    key={post.id}
                    whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
                    onClick={() => handleResultClick(post, 'post')}
                    className="w-full flex items-start space-x-3 px-3 py-2 rounded-lg text-left transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <Text className="text-white text-sm line-clamp-2 break-words">
                        {post.content}
                      </Text>
                      <div className="flex items-center space-x-2 mt-1">
                        <ApperIcon name="Heart" size={14} className="text-gray-400" />
                        <Text variant="caption" color="muted">
                          {post.likeCount}
                        </Text>
                        <ApperIcon name="MessageCircle" size={14} className="text-gray-400" />
                        <Text variant="caption" color="muted">
                          {post.commentCount}
                        </Text>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;