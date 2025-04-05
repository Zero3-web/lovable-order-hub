
import { SpaOrder } from "@/contexts/SpaOrderContext";
import { formatDistance } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";

type OrderCardProps = {
  order: SpaOrder;
  onStatusChange: (orderId: string, status: "pending" | "in-progress" | "completed") => void;
};

export const OrderCard = ({ order, onStatusChange }: OrderCardProps) => {
  const navigate = useNavigate();
  const totalPrice = order.services.reduce((sum, service) => sum + service.price, 0);
  const timeDistance = formatDistance(order.createdAt, new Date(), { addSuffix: true, locale: es });
  
  const statusColor = {
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    "in-progress": "bg-blue-100 text-blue-800 hover:bg-blue-200",
    completed: "bg-green-100 text-green-800 hover:bg-green-200",
  };
  
  const statusIcons = {
    pending: <Circle className="w-4 h-4" />,
    "in-progress": <Clock className="w-4 h-4" />,
    completed: <CheckCircle className="w-4 h-4" />,
  };

  const handleNextStatus = () => {
    if (order.status === "pending") {
      onStatusChange(order.id, "in-progress");
    } else if (order.status === "in-progress") {
      navigate(`/admin/payment/${order.id}`);
    }
  };

  return (
    <Card className="spa-card overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">
            Orden #{order.id}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {timeDistance}
            </span>
          </h3>
          <Badge
            variant="outline"
            className={`${statusColor[order.status]} flex items-center gap-1`}
          >
            {statusIcons[order.status]}
            {order.status === "pending"
              ? "Pendiente"
              : order.status === "in-progress"
              ? "En Proceso"
              : "Finalizado"}
          </Badge>
        </div>
        <p className="text-muted-foreground">{order.customerName}</p>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Servicios:</p>
          <ul className="text-sm">
            {order.services.map((service) => (
              <li key={service.id} className="flex justify-between">
                <span>{service.name}</span>
                <span className="text-muted-foreground">${service.price}</span>
              </li>
            ))}
            <li className="flex justify-between mt-2 pt-2 border-t">
              <span className="font-medium">Total</span>
              <span className="font-medium">${totalPrice}</span>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        {order.status !== "completed" ? (
          <Button 
            variant="default" 
            className="w-full bg-spa-lavender hover:bg-spa-lavender/80 text-spa-dark" 
            onClick={handleNextStatus}
          >
            {order.status === "pending" ? "Iniciar Servicio" : "Finalizar y Cobrar"}
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full" 
            disabled 
          >
            Orden Completada
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
