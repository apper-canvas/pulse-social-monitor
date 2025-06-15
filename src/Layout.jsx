import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { routeArray } from './config/routes';
import ApperIcon from './components/ApperIcon';
import CreatePostModal from './components/organisms/CreatePostModal';
import { useState } from 'react';

const Layout = () => {
  const location = useLocation();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateClick = () => {
    setShowCreateModal(true);
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex flex-col w-64 bg-surface border-r border-gray-700 p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold gradient-text">
            Pulse Social
          </h1>
        </div>
<div className="space-y-2 flex-1">
          {routeArray.filter(route => !route.hideFromNav).map((route) => (
            <NavLink
              key={route.id}
              to={route.path.replace(':username?', '')}
className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-accent text-white'
                    : 'text-gray-700 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <ApperIcon name={route.icon} size={20} />
              <span className="font-medium">{route.label}</span>
            </NavLink>
          ))}
          
          <button
            onClick={handleCreateClick}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-300 hover:bg-gray-800 hover:text-white w-full"
          >
            <ApperIcon name="Plus" size={20} />
            <span className="font-medium">Create</span>
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
<nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-700 px-4 py-2 z-40">
        <div className="flex justify-around items-center">
          {routeArray.filter(route => !route.hideFromNav).slice(0, 4).map((route) => (
            <NavLink
              key={route.id}
              to={route.path.replace(':username?', '')}
className={({ isActive }) =>
                `flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-white'
                }`
              }
            >
              <ApperIcon name={route.icon} size={20} />
              <span className="text-xs font-medium">{route.label}</span>
            </NavLink>
          ))}
          
<button
            onClick={handleCreateClick}
            className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 text-gray-600 hover:text-white"
          >
            <ApperIcon name="Plus" size={20} />
            <span className="text-xs font-medium">Create</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default Layout;