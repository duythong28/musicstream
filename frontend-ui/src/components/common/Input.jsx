const Input = ({ 
  label, 
  error, 
  className = "", 
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 bg-dark-tertiary text-white rounded-lg
          border border-transparent focus:border-primary focus:outline-none
          placeholder-gray-500 transition-colors
          ${error ? "border-red-500" : ""}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;