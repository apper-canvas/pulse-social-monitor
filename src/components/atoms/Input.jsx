import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';

const Input = ({ 
  label, 
  error, 
  icon, 
  type = 'text',
  className = '',
  containerClassName = '',
  ...props 
}) => {
  const inputClasses = `w-full bg-surface border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
    icon ? 'pl-12' : ''
  } ${error ? 'border-error' : ''} ${className}`;

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="w-5 h-5 text-gray-400" />
          </div>
        )}
        <motion.input
          whileFocus={{ scale: 1.02 }}
          type={type}
          className={inputClasses}
          {...props}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-error"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;