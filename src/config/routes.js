import Home from '@/components/pages/Home';
import Explore from '@/components/pages/Explore';
import Profile from '@/components/pages/Profile';
import Messages from '@/components/pages/Messages';
import Notifications from '@/components/pages/Notifications';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  explore: {
    id: 'explore',
    label: 'Explore',
    path: '/explore',
    icon: 'Search',
    component: Explore
  },
  profile: {
    id: 'profile',
    label: 'Profile',
    path: '/profile/:username?',
    icon: 'User',
    component: Profile
  },
  messages: {
    id: 'messages',
    label: 'Messages',
    path: '/messages',
    icon: 'MessageCircle',
    component: Messages
  },
  notifications: {
    id: 'notifications',
    label: 'Notifications',
    path: '/notifications',
    icon: 'Bell',
    component: Notifications
  }
};

export const routeArray = Object.values(routes);
export default routes;