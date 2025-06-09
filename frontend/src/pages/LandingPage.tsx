import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <h1>Vite + React</h1>
      <FileUpload></FileUpload>
      <div className="flex items-center gap-2">
        <Button onClick={() => navigate("/import-transactions")}>Navigate</Button>
      </div>
    </>
  );
}

export default LandingPage;
