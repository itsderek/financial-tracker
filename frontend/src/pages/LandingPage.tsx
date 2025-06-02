import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeToggle></ModeToggle>

      <h1>Vite + React</h1>
      <FileUpload></FileUpload>
      <div className="flex items-center gap-2">
        <Button onClick={() => navigate("/import-transactions")}>Navigate</Button>
      </div>
    </ThemeProvider>
  );
}

export default LandingPage;
