import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Landing from "./pages/Landing.jsx";
import Pricing from "./pages/Pricing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Starred from "./pages/Starred.jsx";
import Shared from "./pages/Shared.jsx";
import Duplicates from "./pages/Duplicates.jsx";
import LargeFiles from "./pages/LargeFiles.jsx";
import Trash from "./pages/Trash.jsx";
import SharePage from "./pages/SharePage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App(props) {
  return (
    <React.Fragment>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0b1526",
            color: "#e7ecf5",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            fontSize: "14px",
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/share/:token" element={<SharePage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/starred"
          element={
            <ProtectedRoute>
              <Starred />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/shared"
          element={
            <ProtectedRoute>
              <Shared />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/duplicates"
          element={
            <ProtectedRoute>
              <Duplicates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/large"
          element={
            <ProtectedRoute>
              <LargeFiles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/trash"
          element={
            <ProtectedRoute>
              <Trash />
            </ProtectedRoute>
          }
        />
      </Routes>
    </React.Fragment>
  );
}

export default App;
