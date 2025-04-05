
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ClientHome from "./ClientHome";

// This page now redirects to ClientHome
const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  return <ClientHome />;
};

export default Index;
