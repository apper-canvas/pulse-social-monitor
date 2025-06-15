import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PostFeed from '../organisms/PostFeed';
import SearchBar from '../molecules/SearchBar';
import Text from '../atoms/Text';

const Explore = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('trending');

  const handleSearchResult = (result, type) => {
    if (type === 'user') {
      navigate(`/profile/${result.username}`);
    } else if (type === 'post') {
      // In a real app, this would navigate to the post detail
      console.log('Navigate to post:', result);
    }
  };

  const tabs = [
    { id: 'trending', label: 'Trending', icon: 'TrendingUp' },
    { id: 'recent', label: 'Recent', icon: 'Clock' }
  ];

  return (
<div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Text variant="heading" size="2xl" className="gradient-text mb-4">
            Explore
          </Text>
          
          <SearchBar 
            onResultSelect={handleSearchResult}
            placeholder="Search for users and posts..."
          />
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-surface rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary to-accent text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Text variant="label">
                {tab.label}
              </Text>
            </button>
          ))}
        </div>

        {/* Content */}
        <PostFeed variant={activeTab === 'trending' ? 'trending' : 'home'} />
      </div>
    </div>
  );
};

export default Explore;