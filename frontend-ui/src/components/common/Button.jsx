const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  onClick, 
  disabled, 
  className = "",
  type = "button",
  ...props 
}) => {
  const baseStyles = "rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-green-500",
    secondary: "bg-dark-tertiary text-white hover:bg-dark-hover",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent text-gray-300 hover:text-white hover:bg-dark-tertiary",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;