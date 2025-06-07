import "./App.css";
import AccountCards from "./pages/AccountCards";
import LandingPage from "./pages/LandingPage";
import TransactionImporter from "./pages/TransactionImporter";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/import-transactions" element={<TransactionImporter />} />
      <Route path="/accounts" element={<AccountCards />} />
    </Routes>
  );
}

export default App;
