import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function TestPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-4">
      <h1 className="text-2xl font-bold">Test Pagina</h1>
      <p>Als je deze pagina kunt zien, werkt het routersysteem correct.</p>
      
      <div className="flex gap-4">
        <Link to="/">
          <Button>Terug naar Home</Button>
        </Link>
        <Link to="/admin">
          <Button variant="outline">Naar Admin Login</Button>
        </Link>
      </div>
    </div>
  );
} 