import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import { AuthProvider } from "./pages/Auth/AuthContext";

function App() {
  return (
    <div className="page-container">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
