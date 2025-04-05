
import { Leaf } from "lucide-react";

export const Logo = ({ size = "default" }: { size?: "small" | "default" | "large" }) => {
  const sizeClasses = {
    small: "text-lg",
    default: "text-2xl",
    large: "text-4xl"
  };
  
  return (
    <div className="flex items-center gap-2">
      <Leaf className="text-spa-dark" size={size === "large" ? 36 : size === "small" ? 20 : 24} />
      <h1 className={`font-display font-bold ${sizeClasses[size]} text-spa-dark`}>
        Serenity Spa
      </h1>
    </div>
  );
};

export default Logo;
