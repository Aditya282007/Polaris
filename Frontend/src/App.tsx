import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { ExpeditionPlanner } from './pages/ExpeditionPlanner';
import { CargoTracking } from './pages/CargoTracking';
import { Inventory } from './pages/Inventory';
import { Personnel } from './pages/Personnel';
import { Emergency } from './pages/Emergency';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/planner" element={<ExpeditionPlanner />} />
          <Route path="/cargo" element={<CargoTracking />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/personnel" element={<Personnel />} />
          <Route path="/emergency" element={<Emergency />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;