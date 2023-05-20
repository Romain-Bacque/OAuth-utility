import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Connect from "./pages/ConnectPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/connect" element={<Connect />} />
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
