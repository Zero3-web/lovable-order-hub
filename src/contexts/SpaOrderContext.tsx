
import { createContext, useContext, useState, ReactNode } from "react";

export type Service = {
  id: string;
  name: string;
  price: number;
};

export type SpaOrder = {
  id: string;
  customerName: string;
  customerPhone?: string; // Nuevo campo opcional para teléfono
  services: Service[];
  status: "pending" | "in-progress" | "completed";
  createdAt: Date;
};

type SpaOrderContextType = {
  orders: SpaOrder[];
  addOrder: (customerName: string, services: Service[], customerPhone?: string) => SpaOrder;
  updateOrderStatus: (orderId: string, status: "pending" | "in-progress" | "completed") => void;
  getOrderById: (orderId: string) => SpaOrder | undefined;
  availableServices: Service[];
};

const defaultServices: Service[] = [
  { id: "1", name: "Masaje", price: 2500 },
  { id: "2", name: "Facial", price: 1800 },
  { id: "3", name: "Depilación", price: 1200 },
  { id: "4", name: "Manicura", price: 900 },
  { id: "5", name: "Pedicura", price: 1100 },
  { id: "6", name: "Tratamiento Capilar", price: 1700 },
];

const SpaOrderContext = createContext<SpaOrderContextType | undefined>(undefined);

export const SpaOrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<SpaOrder[]>([
    {
      id: "1001",
      customerName: "María González",
      customerPhone: "555-1234",
      services: [defaultServices[0], defaultServices[1]],
      status: "pending",
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      id: "1002",
      customerName: "Carlos Pérez",
      customerPhone: "555-5678",
      services: [defaultServices[2], defaultServices[4]],
      status: "in-progress",
      createdAt: new Date(Date.now() - 7200000),
    },
  ]);

  const addOrder = (customerName: string, services: Service[], customerPhone?: string): SpaOrder => {
    const newOrder: SpaOrder = {
      id: `${1000 + orders.length + 1}`,
      customerName: customerName || "Cliente sin nombre",
      customerPhone,
      services,
      status: "pending",
      createdAt: new Date(),
    };

    setOrders(prevOrders => [...prevOrders, newOrder]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: "pending" | "in-progress" | "completed") => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <SpaOrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        getOrderById,
        availableServices: defaultServices,
      }}
    >
      {children}
    </SpaOrderContext.Provider>
  );
};

export const useSpaOrder = () => {
  const context = useContext(SpaOrderContext);
  if (context === undefined) {
    throw new Error("useSpaOrder must be used within a SpaOrderProvider");
  }
  return context;
};
