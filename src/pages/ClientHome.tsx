
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import ServiceCheckbox from "@/components/ServiceCheckbox";
import Logo from "@/components/Logo";
import { Service, useSpaOrder } from "@/contexts/SpaOrderContext";

const ClientHome = () => {
  const navigate = useNavigate();
  const { availableServices, addOrder } = useSpaOrder();
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState("");
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

  const handleServiceToggle = (service: Service, checked: boolean) => {
    if (checked) {
      setSelectedServices((prev) => [...prev, service]);
    } else {
      setSelectedServices((prev) => prev.filter((s) => s.id !== service.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedServices.length === 0) {
      toast({
        title: "No hay servicios seleccionados",
        description: "Por favor, selecciona al menos un servicio",
        variant: "destructive",
      });
      return;
    }

    const newOrder = addOrder(customerName, selectedServices);
    navigate("/order-confirmation", { state: { orderId: newOrder.id } });
  };

  return (
    <div className="min-h-screen spa-gradient flex flex-col items-center py-8 md:py-12 px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <Logo size="large" />
          <p className="text-spa-dark/70 mt-2 text-center max-w-xs">
            Tu momento de relajación comienza aquí
          </p>
        </div>
        
        <Card className="w-full spa-card">
          <CardHeader>
            <CardTitle className="font-display text-xl text-center">
              ¿Qué deseas hacer hoy?
            </CardTitle>
            <CardDescription className="text-center">
              Seleccioná los servicios que querés realizar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="customerName" className="text-sm font-medium">
                  Nombre del cliente (opcional)
                </label>
                <Input
                  id="customerName"
                  placeholder="Tu nombre"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="bg-white/50"
                />
              </div>
              
              <Separator className="bg-spa-lavender/30" />
              
              <div className="space-y-3">
                <label className="text-sm font-medium">Servicios disponibles</label>
                {availableServices.map((service) => (
                  <ServiceCheckbox
                    key={service.id}
                    service={service}
                    onToggle={handleServiceToggle}
                  />
                ))}
              </div>
              
              {selectedServices.length > 0 && (
                <div className="py-3 px-4 rounded-lg bg-spa-lavender/10">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>
                      ${selectedServices.reduce((sum, service) => sum + service.price, 0)}
                    </span>
                  </div>
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full bg-spa-lavender hover:bg-spa-lavender/80 text-spa-dark"
              >
                Confirmar Orden
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="w-full text-center mt-6">
          <Button 
            variant="link" 
            onClick={() => navigate("/admin")}
            className="text-spa-dark/70 hover:text-spa-dark"
          >
            Acceso Administración
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientHome;
