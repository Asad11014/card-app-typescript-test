import axios from "axios";
import { FC, ReactNode, createContext, useEffect, useState } from "react";
import { Entry, EntryContextType } from "../@types/context";

// Create a context with default value as null
export const EntryContext = createContext<EntryContextType | null>(null);

export const EntryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Initialise the state by fetching entries and checking for saved theme
  const initState = async () => {
    const data = await axios.get<Entry[]>("http://localhost:3001/get/");
    const initialStateBody = data.data;
    setEntries(initialStateBody);
  };

  useEffect(() => {
    initState(); // Fetch entries when the component mounts

    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme); // Set the theme from localStorage
      // Apply the dark mode class to the document element if the saved theme is dark
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const saveEntry = async (entry: Entry) => {
    const requestData = await axios.post<Entry>("http://localhost:3001/create/", entry);
    const newEntry = requestData.data;
    setEntries([...entries, newEntry]);
  };

  const updateEntry = async (id: string, entry: Entry) => {
    await axios.put<Entry>(`http://localhost:3001/update/${id}`, entry);
    setEntries((entries) => {
      const entryIndex = entries.findIndex((obj) => obj.id == id);
      entries[entryIndex] = entry;
      console.log(entries);
      return entries;
    });
  };

  const deleteEntry = async (id: string) => {
    await axios.delete<Entry>(`http://localhost:3001/delete/${id}`);
    setEntries((e) => e.filter((entry) => entry.id != id));
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme); // Update theme state
    // Apply or remove the dark mode class from the document element based on the new theme
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    // Save the new theme preference to localStorage
    localStorage.setItem("theme", newTheme);
  };

  return (
    <EntryContext.Provider value={{ entries, theme, saveEntry, updateEntry, deleteEntry, toggleTheme }}>
      {children}
    </EntryContext.Provider>
  );
};
