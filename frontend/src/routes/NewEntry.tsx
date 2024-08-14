import { ChangeEvent, MouseEvent, useContext, useState } from "react";
import { Entry, EntryContextType } from "../@types/context";
import { EntryContext } from "../utilities/globalContext";

export default function NewEntry() {
  const emptyEntry: Entry = { title: "", description: "", created_at: new Date() };
  const { saveEntry } = useContext(EntryContext) as EntryContextType;
  const [newEntry, setNewEntry] = useState<Entry>(emptyEntry);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewEntry({
      ...newEntry,
      [event.target.name]: event.target.value,
    });
  };

  const handleSend = (e: MouseEvent<HTMLButtonElement>) => {
    saveEntry(newEntry);
    setNewEntry(emptyEntry);
  };

  return (
    <section className="flex justify-center flex-col w-fit ml-auto mr-auto mt-10 gap-5 bg-gray-300 dark:bg-gray-800 p-8 rounded-md">
      {/* Background color for section: light mode (bg-gray-300) and dark mode (dark:bg-gray-800) */}

      <input
        className="p-3 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        type="text"
        placeholder="Title"
        name="title"
        value={newEntry.title}
        onChange={handleInputChange}
      />
      {/* Background color for input field: light mode (bg-white) and dark mode (dark:bg-gray-700) */}
      {/* Text color for input field: light mode (text-gray-900) and dark mode (dark:text-gray-100) */}

      <textarea
        className="p-3 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        placeholder="Description"
        name="description"
        value={newEntry.description}
        onChange={handleInputChange}
      />
      {/* Background color for textarea: light mode (bg-white) and dark mode (dark:bg-gray-700) */}
      {/* Text color for textarea: light mode (text-gray-900) and dark mode (dark:text-gray-100) */}

      <input
        className="p-3 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        type="date"
        name="created_at"
        value={new Date(newEntry.created_at).toISOString().split("T")[0]}
        onChange={handleInputChange}
      />
      {/* Background color for date input: light mode (bg-white) and dark mode (dark:bg-gray-700) */}
      {/* Text color for date input: light mode (text-gray-900) and dark mode (dark:text-gray-100) */}

      <button onClick={handleSend} className="bg-blue-400 hover:bg-blue-600 font-semibold text-white p-3 rounded-md">
        Create
      </button>
      {/* Button styles remain consistent, with no specific dark mode changes needed */}
    </section>
  );
}
