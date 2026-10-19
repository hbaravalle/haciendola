import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import ProductList from "./pages/ProductList/ProductList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import NewPassword from "./pages/NewPassword";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.scss";

function App() {
  const user = useSelector((state) => state.auth);
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/auth/forgot-password/:step?"
          element={<ResetPassword />}
        />
        <Route path="/auth/new-password" element={<NewPassword />} />
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/" element={<ProductList />} />
        </Route>
      </Routes>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: "0.875rem",
          },
        }}
      />
    </>
  );
}

export default App;
