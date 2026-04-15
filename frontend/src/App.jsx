import { useState, useEffect } from "react";
import Home from "./Home";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Input from "./Input";
import LearnMore from "./Learnmore";
import PublicPitch from "./PublicPitch";
import CustomCursor from "./CustomCursor";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProtectedRoute({ children, setPage, targetPage, setIntendedPage }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("launchmate_token") || localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      setIntendedPage(targetPage);
      setPage("login");
    }
  }, [setPage, targetPage, setIntendedPage]);

  if (!isAuthenticated || (!localStorage.getItem("token") && !localStorage.getItem("launchmate_token"))) return null;

  return children;
}

function App() {
  // 1. INITIALIZE STATE FROM LOCALSTORAGE
  const [page, setPage] = useState(() => {
    return localStorage.getItem("launchmate_current_page") || "home";
  });
  const [intendedPage, setIntendedPage] = useState(null);

  // 2. PERSIST PAGE STATE
  useEffect(() => {
    localStorage.setItem("launchmate_current_page", page);
  }, [page]);

  // 3. CENTRALIZED LOGOUT
  const handleLogout = () => {
    const keysToRemove = [
      "token", 
      "launchmate_token", 
      "launchmate_is_logged_in", 
      "launchmate_current_page", 
      "launchmate_active_idea", 
      "launchmate_analysis_data"
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    setPage("home");
    window.location.reload();
  };

  // INTERCEPT PUBLIC URLS
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("shared")) {
    return (
       <>
         <CustomCursor />
         <ToastContainer theme="dark" />
         <PublicPitch />
       </>
    );
  }

  const withGlobalUI = (Component) => (
    <>
      <CustomCursor />
      <ToastContainer theme="dark" />
      {Component}
    </>
  );

  if (page === "home") return withGlobalUI(<Home setPage={setPage} />);
  
  if (page === "login") {
    return withGlobalUI(<Login setPage={setPage} intendedPage={intendedPage} setIntendedPage={setIntendedPage} />);
  }
  
  if (page === "product" || page === "features" || page === "about" || page === "learn") {
    return withGlobalUI(<LearnMore setPage={setPage} section={page} />);
  }

  if (page === "dashboard") {
    return (
      <ProtectedRoute setPage={setPage} targetPage="dashboard" setIntendedPage={setIntendedPage}>
        {withGlobalUI(<Dashboard setPage={setPage} onLogout={handleLogout} />)}
      </ProtectedRoute>
    );
  }
  
  if (page === "input") {
    return (
      <ProtectedRoute setPage={setPage} targetPage="input" setIntendedPage={setIntendedPage}>
        {withGlobalUI(<Input setPage={setPage} />)}
      </ProtectedRoute>
    );
  }

  return withGlobalUI(<div>Dashboard coming...</div>);
}

export default App;
