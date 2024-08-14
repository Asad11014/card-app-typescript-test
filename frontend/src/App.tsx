import React, { useContext, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import AllEntries from "./routes/AllEntries";
import EditEntry from "./routes/EditEntry";
import NewEntry from "./routes/NewEntry";
import { EntryContext, EntryProvider } from "./utilities/globalContext";

// Component that renders the application content including routes and navigation
const AppContent = () => {
  const context = useContext(EntryContext); // Access the context object to get the theme

  useEffect(() => {
    if (context?.theme) {
      // Toggle dark mode class on the document element based on the current theme
      document.documentElement.classList.toggle("dark", context.theme === "dark");
    }
  }, [context?.theme]); // Re-run this effect whenever the theme changes

  return (
    <section className={`min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white`}>
      {/* Render navigation bar */}
      <NavBar />
      {/* Define routes for the application */}
      <Routes>
        <Route path="/" element={<AllEntries />} />
        <Route path="create" element={<NewEntry />} />
        <Route path="edit/:id" element={<EditEntry />} />
      </Routes>
    </section>
  );
};

// Main application component that sets up the routing and context provider
export default function App() {
  return (
    <EntryProvider>
      {" "}
      {/* Provide context to the entire app */}
      <Router>
        {" "}
        {/* Setup router for client-side routing */}
        <AppContent /> {/* Render the content including routes and navigation */}
      </Router>
    </EntryProvider>
  );
}
