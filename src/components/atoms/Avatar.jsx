import { motion } from 'framer-motion';

const Avatar = ({ 
  src, 
  alt, 
  size = 'md', 
  className = '',
  ...props 
}) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  };

  const avatarClasses = `${sizes[size]} rounded-full object-cover border-2 border-gray-700 ${className}`;

  return (
    <motion.img
      whileHover={{ scale: 1.05 }}
      src={src}
      alt={alt}
      className={avatarClasses}
      {...props}
    />
  );
};

export default Avatar;