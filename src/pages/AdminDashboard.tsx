
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from "@/components/Logo";
import OrderCard from "@/components/OrderCard";
import { useSpaOrder, SpaOrder } from "@/contexts/SpaOrderContext";
import { LogOut } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useSpaOrder();
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredOrders: Record<string, SpaOrder[]> = {
    all: orders,
    pending: orders.filter(order => order.status === "pending"),
    "in-progress": orders.filter(order => order.status === "in-progress"),
    completed: orders.filter(order => order.status === "completed"),
  };

  const handleLogout = () => {
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-spa-mint/30">
      <header className="bg-white shadow-sm py-4">
        <div className="container max-w-6xl mx-auto px-4 flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" />
              <span>Salir</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-display font-bold mb-2">Panel de Órdenes</h1>
        <p className="text-muted-foreground mb-6">
          Administra las órdenes de servicios y su estado
        </p>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-spa-lavender/20">
              <TabsTrigger value="all" className="data-[state=active]:bg-spa-lavender data-[state=active]:text-spa-dark">
                Todas
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-spa-lavender data-[state=active]:text-spa-dark">
                Pendientes
              </TabsTrigger>
              <TabsTrigger value="in-progress" className="data-[state=active]:bg-spa-lavender data-[state=active]:text-spa-dark">
                En Proceso
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-spa-lavender data-[state=active]:text-spa-dark">
                Completadas
              </TabsTrigger>
            </TabsList>

            <Button 
              onClick={() => navigate("/")} 
              variant="outline"
              className="border-spa-lavender text-spa-dark hover:bg-spa-lavender/10"
            >
              Crear Nueva Orden
            </Button>
          </div>

          {Object.keys(filteredOrders).map((tabId) => (
            <TabsContent key={tabId} value={tabId} className="space-y-4">
              {filteredOrders[tabId].length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOrders[tabId].map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onStatusChange={updateOrderStatus}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white/50 rounded-lg border border-dashed">
                  <p className="text-muted-foreground">
                    No hay órdenes {tabId !== "all" ? `en estado "${tabId}"` : ""} disponibles
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
