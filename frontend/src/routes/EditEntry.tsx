import { ChangeEvent, MouseEvent, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Entry, EntryContextType } from "../@types/context";
import { EntryContext } from "../utilities/globalContext";

export default function EditEntry() {
  const { id } = useParams();
  const emptyEntry: Entry = { title: "", description: "", created_at: new Date(), scheduledDate: null };

  const { updateEntry, entries } = useContext(EntryContext) as EntryContextType;
  const [newEntry, setNewEntry] = useState<Entry>(emptyEntry);

  useEffect(() => {
    const entry = entries.find((entry) => entry.id == id);
    if (entry) setNewEntry(entry);
  }, [entries, id]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNewEntry({
      ...newEntry,
      [name]: name === 'scheduledDate' ? (value ? new Date(value) : null) : value,
    });
  };

  const handleSend = (e: MouseEvent<HTMLButtonElement>) => {
    updateEntry(id as string, newEntry);
  };

  return (
    // included dark mode styles
    <section className="flex justify-center flex-col w-fit ml-auto mr-auto mt-10 gap-5 bg-gray-300 dark:bg-gray-800 p-8 rounded-md">
   

      <input
        className="p-3 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        type="text"
        placeholder="Title"
        name="title"
        value={newEntry.title}
        onChange={handleInputChange}
      />
      

      <textarea
        className="p-3 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        placeholder="Description"
        name="description"
        value={newEntry.description}
        onChange={handleInputChange}
      />


      <input
        className="p-3 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        type="date"
        name="created_at"
        value={new Date(newEntry.created_at).toISOString().split("T")[0]}
        onChange={handleInputChange}
      />
    

      <input
        className="p-3 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        type="date"
        name="scheduledDate"
        value={newEntry.scheduledDate ? new Date(newEntry.scheduledDate).toISOString().split("T")[0] : ''}
        onChange={handleInputChange}
      />

      <button onClick={handleSend} className="bg-blue-400 hover:bg-blue-600 font-semibold text-white p-3 rounded-md">
        Update
      </button>
      
    </section>
  );
}
