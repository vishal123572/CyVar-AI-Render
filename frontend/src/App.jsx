import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Vulnerabilities from "./pages/Vulnerabilities";
import RiskAnalysis from "./pages/RiskAnalysis";
import Simulator from "./pages/Simulator";
import InvestmentOptimizer from "./pages/InvestmentOptimizer";
import Compliance from "./pages/Compliance";
import Copilot from "./pages/Copilot";
import Reports from "./pages/Reports";
import DigitalTwin from "./pages/DigitalTwin";
import Connectors from "./pages/Connectors";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route element={<MainLayout />}>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/assets"
            element={<Assets />}
          />

          <Route
            path="/vulnerabilities"
            element={<Vulnerabilities />}
          />
          <Route
  path="/connectors"
  element={<Connectors />}
/>
          <Route
            path="/risk-analysis"
            element={<RiskAnalysis />}
          />

          <Route
  path="/digital-twin"
  element={<DigitalTwin />}
/>

          <Route
            path="/simulator"
            element={<Simulator />}
          />

          <Route
            path="/investment"
            element={<InvestmentOptimizer />}
          />

          <Route
            path="/compliance"
            element={<Compliance />}
          />

          <Route
            path="/copilot"
            element={<Copilot />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

        </Route>

      </Routes>

    </BrowserRouter>

  );
}

export default App;