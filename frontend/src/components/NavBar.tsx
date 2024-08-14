import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { EntryContext } from "../utilities/globalContext";

export default function NavBar() {
  const context = useContext(EntryContext);

  return (
    <nav className="flex justify-center gap-5 bg-gray-200 dark:bg-gray-800 p-4">
      {/* Navigation links */}
      <NavLink className="m-3 p-4 text-xl bg-blue-400 hover:bg-blue-500 rounded-md font-medium text-white" to={"/"}>
        All Entries
      </NavLink>
      <NavLink
        className="m-3 p-4 text-xl bg-blue-400 hover:bg-blue-500 rounded-md font-medium text-white"
        to={"/create"}
      >
        New Entry
      </NavLink>

      {/* Button to toggle dark mode */}
      <button
        onClick={context?.toggleTheme} // Calls the toggleTheme function from context when clicked
        className="m-3 p-4 text-xl bg-gray-600 hover:bg-gray-700 rounded-md font-medium text-white"
      >
        {/* Button text changes based on the current theme */}
        Toggle {context?.theme === "light" ? "Dark" : "Light"} Mode
      </button>
    </nav>
  );
}
