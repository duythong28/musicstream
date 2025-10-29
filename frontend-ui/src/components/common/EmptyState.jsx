import { Music } from "lucide-react";

const EmptyState = ({ 
  icon: Icon = Music, 
  title = "No items found", 
  description = "",
  action = null 
}) => {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-dark-tertiary mb-4">
        <Icon className="text-gray-400" size={40} />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;