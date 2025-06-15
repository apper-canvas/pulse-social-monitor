const Text = ({ 
  variant = 'body', 
  size = 'base', 
  color = 'white',
  className = '',
  children,
  ...props 
}) => {
  const variants = {
    heading: 'font-display font-bold',
    subheading: 'font-display font-semibold',
    body: 'font-body',
    caption: 'font-body text-sm',
    label: 'font-body font-medium'
  };

  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl'
  };

  const colors = {
white: 'text-gray-900',
    gray: 'text-gray-600',
    muted: 'text-gray-500',
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    error: 'text-error',
    success: 'text-success'
  };

  const Component = variant === 'heading' ? 'h1' : 
                   variant === 'subheading' ? 'h2' : 
                   variant === 'caption' ? 'small' : 'p';

  const textClasses = `${variants[variant]} ${sizes[size]} ${colors[color]} ${className}`;

  return (
    <Component className={textClasses} {...props}>
      {children}
    </Component>
  );
};

export default Text;