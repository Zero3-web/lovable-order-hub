
import { useState } from "react";
import { Service } from "@/contexts/SpaOrderContext";
import { Checkbox } from "@/components/ui/checkbox";

type ServiceCheckboxProps = {
  service: Service;
  onToggle: (service: Service, checked: boolean) => void;
};

export const ServiceCheckbox = ({ service, onToggle }: ServiceCheckboxProps) => {
  const [checked, setChecked] = useState(false);

  const handleChange = (checked: boolean) => {
    setChecked(checked);
    onToggle(service, checked);
  };

  return (
    <div className="flex items-center space-x-4 p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-spa-lavender/20 hover:bg-spa-lavender/10 transition-colors">
      <Checkbox
        id={`service-${service.id}`}
        checked={checked}
        onCheckedChange={handleChange}
        className="border-spa-lavender data-[state=checked]:bg-spa-lavender data-[state=checked]:text-white"
      />
      <div className="flex-1 flex justify-between">
        <label
          htmlFor={`service-${service.id}`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {service.name}
        </label>
        <span className="text-sm text-muted-foreground font-medium">
          ${service.price}
        </span>
      </div>
    </div>
  );
};

export default ServiceCheckbox;
