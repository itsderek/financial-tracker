import "./App.css";
import Layout from "./components/layout";
import AccountCards from "./pages/AccountCards";
import AddAccount from "./pages/AddAccount";
import AddAccountV2 from "./pages/AddAccountV2";
import LandingPage from "./pages/LandingPage";
import TransactionImporter from "./pages/TransactionImporter";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/import-transactions" element={<TransactionImporter />} />
        <Route path="/accounts" element={<AccountCards />} />
        <Route path="/add-account" element={<AddAccount />} />

        <Route path="/add-account2" element={<AddAccountV2 />} />
      </Route>
    </Routes>
  );
}

export default App;
