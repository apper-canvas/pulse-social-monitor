import { motion } from 'framer-motion';
import PostFeed from '../organisms/PostFeed';
import Text from '../atoms/Text';

const Home = () => {
  return (
<div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Text variant="heading" size="2xl" className="gradient-text mb-2">
            Home Feed
          </Text>
          <Text color="muted">
            Discover what's happening with the people you follow
          </Text>
        </motion.div>

        <PostFeed />
      </div>
    </div>
  );
};

export default Home;