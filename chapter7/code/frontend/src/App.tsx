import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/Homepage";
import AdminPage from "./pages/AdminPage";
import AuthComponent from "./components/AuthComponent";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/admin"
          element={
            <AuthComponent>
              <AdminPage />
            </AuthComponent>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
