
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Logo from "@/components/Logo";
import { useSpaOrder } from "@/contexts/SpaOrderContext";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getOrderById } = useSpaOrder();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Get orderId from location state or fall back to random number
    const id = location.state?.orderId || String(1000 + Math.floor(Math.random() * 100));
    setOrderId(id);
  }, [location.state]);

  const order = orderId ? getOrderById(orderId) : null;

  return (
    <div className="min-h-screen spa-gradient flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <Logo size="default" />
        </div>

        <Card className="w-full spa-card">
          <CardHeader className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-spa-lavender/30 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-spa-dark" />
            </div>
            <CardTitle className="font-display text-xl text-center">
              ¡Tu orden ha sido registrada!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Número de orden</p>
              <p className="text-2xl font-display font-bold text-spa-dark">
                #{orderId}
              </p>
            </div>

            {order && (
              <div className="space-y-2 py-3 px-4 rounded-lg bg-spa-lavender/10 text-left">
                <p className="text-sm font-medium">Servicios solicitados:</p>
                <ul className="text-sm space-y-1">
                  {order.services.map((service) => (
                    <li key={service.id}>{service.name}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-spa-dark/80">
                Por favor, aguardá a ser llamado.
              </p>
              <Button
                onClick={() => navigate("/")}
                className="w-full bg-spa-lavender hover:bg-spa-lavender/80 text-spa-dark"
              >
                Crear Nueva Orden
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderConfirmation;
