import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import ApplyLeave from "./pages/ApplyLeave";
import History from "./pages/History";
import Result from "./pages/Result";
import Notifications from "./pages/Notifications";
import Analytics from "./pages/Analytics";

import Login from "./pages/Login";
import Register from "./pages/Register";

import PrivateRoute from "./components/PrivateRoute";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/analytics" element={<Analytics />} />


        {/* Dashboard */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />


        {/* Employee */}
        <Route
          path="/apply"
          element={
            <PrivateRoute role="employee">
              <ApplyLeave />
            </PrivateRoute>
          }
        />

        <Route
          path="/result"
          element={
            <PrivateRoute role="employee">
              <Result />
            </PrivateRoute>
          }
        />


        {/* History (Both) */}
        <Route
          path="/history"
          element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          }
        />


        {/* HR Only */}
        <Route
          path="/notifications"
          element={
            <PrivateRoute role="hr">
              <Notifications />
            </PrivateRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <PrivateRoute role="hr">
              <Analytics />
            </PrivateRoute>
          }
        />


      </Routes>

    </BrowserRouter>
  );
}

export default App;
