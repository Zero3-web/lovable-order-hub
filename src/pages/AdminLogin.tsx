
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Logo from "@/components/Logo";
import { Lock } from "lucide-react";

type AdminLoginProps = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
};

const AdminLogin = ({ isAuthenticated, setIsAuthenticated }: AdminLoginProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Simple admin password (for demo purposes only - not secure)
  const ADMIN_PASSWORD = "admin123";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        navigate("/admin/dashboard");
        toast({
          title: "Acceso exitoso",
          description: "Has ingresado al panel de administración",
        });
      } else {
        toast({
          title: "Contraseña incorrecta",
          description: "Por favor, intenta nuevamente",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 800);
  };

  if (isAuthenticated) {
    navigate("/admin/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen spa-gradient flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <Logo size="default" />
          <p className="text-spa-dark/70 mt-2">Panel de Administración</p>
        </div>

        <Card className="w-full spa-card">
          <CardHeader>
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 rounded-full bg-spa-lavender/30">
                <Lock className="h-5 w-5 text-spa-dark" />
              </div>
            </div>
            <CardTitle className="font-display text-xl text-center">
              Acceso de Administrador
            </CardTitle>
            <CardDescription className="text-center">
              Ingresa la contraseña para acceder al panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/50"
                />
                <p className="text-xs text-muted-foreground text-right">
                  Contraseña de demo: admin123
                </p>
              </div>
              <Button
                type="submit"
                className="w-full bg-spa-dark hover:bg-spa-dark/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Verificando..." : "Ingresar"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="w-full text-center mt-6">
          <Button 
            variant="link" 
            onClick={() => navigate("/")}
            className="text-spa-dark/70 hover:text-spa-dark"
          >
            Volver a Inicio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
