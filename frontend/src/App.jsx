import { useState, useEffect, useMemo } from "react";
import Home from "./Home";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Input from "./Input";
import LearnMore from "./Learnmore";
import PublicPitch from "./PublicPitch";
import CustomCursor from "./CustomCursor";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * LayoutWrapper handles global UI components to prevent unmounting during page transitions.
 */
function LayoutWrapper({ children }) {
  return (
    <>
      <CustomCursor />
      <ToastContainer theme="dark" />
      {children}
    </>
  );
}

/**
 * ProtectedRoute checks for authentication and redirects to login if the token is missing.
 */
function ProtectedRoute({ children, setPage, targetPage, setIntendedPage }) {
  const token = localStorage.getItem("launchmate_token") || localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setIntendedPage(targetPage);
      setPage("login");
    }
  }, [token, setPage, targetPage, setIntendedPage]);

  if (!token) return null;

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
    window.location.reload();
  };

  // 4. INTERCEPT PUBLIC URLS (SHARED LINKS)
  const sharedId = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("shared");
  }, []);

  if (sharedId) {
    return (
      <LayoutWrapper>
        <PublicPitch />
      </LayoutWrapper>
    );
  }

  // 5. PAGE ROUTING LOGIC
  const renderPage = () => {
    if (page === "home") return <Home setPage={setPage} />;
    
    if (page === "login") {
      return (
        <Login 
          setPage={setPage} 
          intendedPage={intendedPage} 
          setIntendedPage={setIntendedPage} 
        />
      );
    }
    
    if (["product", "features", "about", "learn"].includes(page)) {
      return <LearnMore setPage={setPage} section={page} />;
    }

    if (page === "dashboard") {
      return (
        <ProtectedRoute setPage={setPage} targetPage="dashboard" setIntendedPage={setIntendedPage}>
          <Dashboard setPage={setPage} onLogout={handleLogout} />
        </ProtectedRoute>
      );
    }
    
    if (page === "input") {
      return (
        <ProtectedRoute setPage={setPage} targetPage="input" setIntendedPage={setIntendedPage}>
          <Input setPage={setPage} />
        </ProtectedRoute>
      );
    }

    // Default Fallback
    return <Home setPage={setPage} />;
  };

  return <LayoutWrapper>{renderPage()}</LayoutWrapper>;
}

export default App;