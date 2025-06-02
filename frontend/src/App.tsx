import "./App.css";
import LandingPage from "./pages/LandingPage";
import TransactionImporter from "./pages/TransactionImporter";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/import-transactions" element={<TransactionImporter />} />
    </Routes>
  );
}

export default App;
