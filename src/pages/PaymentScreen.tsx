
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import Logo from "@/components/Logo";
import { useSpaOrder } from "@/contexts/SpaOrderContext";
import { ArrowLeft, CheckCircle } from "lucide-react";

const PaymentScreen = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById, updateOrderStatus } = useSpaOrder();
  const { toast } = useToast();
  
  const order = orderId ? getOrderById(orderId) : null;
  
  const [paymentMethod, setPaymentMethod] = useState("");
  const [total, setTotal] = useState(
    order
      ? order.services.reduce((sum, service) => sum + service.price, 0)
      : 0
  );
  
  const handleCompleteOrder = () => {
    if (!paymentMethod) {
      toast({
        title: "Método de pago requerido",
        description: "Por favor, selecciona un método de pago",
        variant: "destructive",
      });
      return;
    }
    
    if (orderId) {
      updateOrderStatus(orderId, "completed");
      toast({
        title: "Orden completada",
        description: "El pago ha sido registrado y la orden archivada",
      });
      navigate("/admin/dashboard");
    }
  };
  
  if (!order) {
    return (
      <div className="min-h-screen spa-gradient flex items-center justify-center">
        <Card className="w-full max-w-md spa-card">
          <CardContent className="py-12 text-center">
            <p className="text-xl">Orden no encontrada</p>
            <Button 
              onClick={() => navigate("/admin/dashboard")}
              variant="link" 
              className="mt-4"
            >
              Volver al panel
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-spa-mint/30">
      <header className="bg-white shadow-sm py-4">
        <div className="container max-w-3xl mx-auto px-4 flex justify-between items-center">
          <Logo />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Button>
        </div>
      </header>
      
      <main className="container max-w-3xl mx-auto px-4 py-8">
        <Card className="spa-card">
          <CardHeader>
            <CardTitle className="text-xl font-display flex items-center justify-between">
              <span>Finalizar Orden #{order.id}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Detalles del cliente</h3>
              <p className="text-spa-dark">{order.customerName}</p>
            </div>
            
            <Separator className="bg-spa-lavender/30" />
            
            <div>
              <h3 className="text-lg font-medium mb-3">Servicios realizados</h3>
              <div className="space-y-3">
                {order.services.map((service) => (
                  <div key={service.id} className="flex justify-between items-center py-2">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-spa-dark mr-2" />
                      <span>{service.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2 text-muted-foreground">$</span>
                      <Input
                        type="number"
                        value={service.price}
                        onChange={(e) => {
                          const newValue = parseFloat(e.target.value) || 0;
                          // In a real app, we would update the service price
                          // For now, just recalculate total based on changes
                          const priceDiff = newValue - service.price;
                          setTotal((prev) => prev + priceDiff);
                        }}
                        className="w-24 bg-white/50 text-right"
                      />
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-spa-lavender/30">
                  <span className="font-semibold">Total a cobrar</span>
                  <span className="font-semibold text-lg">${total}</span>
                </div>
              </div>
            </div>
            
            <Separator className="bg-spa-lavender/30" />
            
            <div className="space-y-2">
              <Label htmlFor="payment-method">Método de pago</Label>
              <Select onValueChange={setPaymentMethod} value={paymentMethod}>
                <SelectTrigger id="payment-method" className="bg-white/50">
                  <SelectValue placeholder="Seleccionar método de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Efectivo</SelectItem>
                  <SelectItem value="card">Tarjeta</SelectItem>
                  <SelectItem value="transfer">Transferencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleCompleteOrder}
              className="w-full bg-spa-lavender hover:bg-spa-lavender/80 text-spa-dark"
            >
              Finalizar Orden y Archivar
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default PaymentScreen;
