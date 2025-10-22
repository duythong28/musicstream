const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-400">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;