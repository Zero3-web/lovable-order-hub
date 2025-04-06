
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Logo from "@/components/Logo";
import { useSpaOrder } from "@/contexts/SpaOrderContext";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  ChartBar
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

type PaymentMethod = "cash" | "card" | "transfer";

interface CompletedOrder {
  id: string;
  customerName: string;
  services: {
    id: string;
    name: string;
    price: number;
  }[];
  paymentMethod: PaymentMethod;
  date: string;
  time: string;
  totalAmount: number;
}

const CashReport = () => {
  const navigate = useNavigate();
  const { orders } = useSpaOrder();
  const [dateFilter, setDateFilter] = useState("all");

  // En un caso real, estas órdenes vendrían de una base de datos
  // Para este ejemplo, creamos datos de muestra
  const completedOrders: CompletedOrder[] = [
    {
      id: "2001",
      customerName: "María Gómez",
      services: [
        { id: "1", name: "Masaje", price: 2500 },
        { id: "2", name: "Facial", price: 1800 }
      ],
      paymentMethod: "cash",
      date: "2025-04-03",
      time: "10:30",
      totalAmount: 4300
    },
    {
      id: "2002",
      customerName: "Juan Pérez",
      services: [
        { id: "3", name: "Depilación", price: 1200 }
      ],
      paymentMethod: "card",
      date: "2025-04-04",
      time: "14:15",
      totalAmount: 1200
    },
    {
      id: "2003",
      customerName: "Ana López",
      services: [
        { id: "4", name: "Manicura", price: 900 },
        { id: "5", name: "Pedicura", price: 1100 }
      ],
      paymentMethod: "transfer",
      date: "2025-04-05",
      time: "16:00",
      totalAmount: 2000
    },
    {
      id: "2004",
      customerName: "Carlos Rodríguez",
      services: [
        { id: "1", name: "Masaje", price: 2500 }
      ],
      paymentMethod: "cash",
      date: "2025-04-06",
      time: "11:00",
      totalAmount: 2500
    },
    {
      id: "2005",
      customerName: "Laura Martínez",
      services: [
        { id: "6", name: "Tratamiento Capilar", price: 1700 }
      ],
      paymentMethod: "card",
      date: "2025-04-06",
      time: "13:30",
      totalAmount: 1700
    }
  ];

  // Calculamos totales y estadísticas
  const totalAmount = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  
  const paymentMethodTotals = completedOrders.reduce((acc, order) => {
    acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + order.totalAmount;
    return acc;
  }, {} as Record<PaymentMethod, number>);
  
  const cashTotal = paymentMethodTotals.cash || 0;
  const cardTotal = paymentMethodTotals.card || 0;
  const transferTotal = paymentMethodTotals.transfer || 0;
  
  const totalServices = completedOrders.reduce((sum, order) => sum + order.services.length, 0);
  const totalClients = new Set(completedOrders.map(order => order.customerName)).size;
  
  // Servicio más popular
  const serviceCount: Record<string, { count: number, revenue: number }> = {};
  completedOrders.forEach(order => {
    order.services.forEach(service => {
      if (!serviceCount[service.name]) {
        serviceCount[service.name] = { count: 0, revenue: 0 };
      }
      serviceCount[service.name].count += 1;
      serviceCount[service.name].revenue += service.price;
    });
  });
  
  const popularServices = Object.entries(serviceCount)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count);
  
  const mostPopularService = popularServices[0] || { name: "N/A", count: 0, revenue: 0 };

  return (
    <div className="min-h-screen bg-spa-mint/30">
      <header className="bg-white shadow-sm py-4">
        <div className="container max-w-6xl mx-auto px-4 flex justify-between items-center">
          <Logo />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al Panel</span>
          </Button>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-display font-bold mb-2">Cuadre de Caja</h1>
        <p className="text-muted-foreground mb-6">
          Visualiza las estadísticas de ventas y pagos completados
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/80">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                  <p className="text-2xl font-bold">${totalAmount}</p>
                </div>
                <DollarSign className="h-8 w-8 text-spa-lavender opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Servicios Completados</p>
                  <p className="text-2xl font-bold">{totalServices}</p>
                </div>
                <Calendar className="h-8 w-8 text-spa-lavender opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Clientes Atendidos</p>
                  <p className="text-2xl font-bold">{totalClients}</p>
                </div>
                <Users className="h-8 w-8 text-spa-lavender opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Servicio más popular</p>
                  <p className="text-2xl font-bold">{mostPopularService.name}</p>
                </div>
                <ChartBar className="h-8 w-8 text-spa-lavender opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Órdenes Completadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <span className="capitalize">{order.paymentMethod}</span>
                        </TableCell>
                        <TableCell className="text-right">${order.totalAmount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Pagos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Efectivo</span>
                  <span className="font-medium">${cashTotal}</span>
                </div>
                <Progress value={(cashTotal / totalAmount) * 100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tarjeta</span>
                  <span className="font-medium">${cardTotal}</span>
                </div>
                <Progress value={(cardTotal / totalAmount) * 100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Transferencia</span>
                  <span className="font-medium">${transferTotal}</span>
                </div>
                <Progress value={(transferTotal / totalAmount) * 100} className="h-2" />
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h4 className="font-medium mb-3">Top Servicios por Ingresos</h4>
                <div className="space-y-4">
                  {popularServices.slice(0, 3).map((service) => (
                    <div key={service.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{service.name}</span>
                        <span className="font-medium">${service.revenue}</span>
                      </div>
                      <Progress value={(service.revenue / totalAmount) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CashReport;
