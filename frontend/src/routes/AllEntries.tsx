import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Entry, EntryContextType } from "../@types/context";
import { EntryContext } from "../utilities/globalContext";

export default function AllEntries() {
  const { entries, deleteEntry } = useContext(EntryContext) as EntryContextType;
  let navigate = useNavigate();

  if (entries.length === 0) {
    return (
      <section>
        {/* Heading for empty state */}
        <h1 className="text-center font-semibold text-2xl m-5">You don't have any cards</h1>
        {/* Link to create a new entry */}
        <p className="text-center font-medium text-md">
          Let's{" "}
          <Link className="text-blue-400 underline underline-offset-1" to="/create">
            Create One
          </Link>
        </p>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {entries.map((entry: Entry, index: number) => {
        return (
          <div
            id={entry.id}
            key={index}
            className="bg-gray-300 dark:bg-gray-800 shadow-md dark:shadow-gray-900 m-3 p-4 rounded flex flex-col justify-between transition-colors duration-300"
          >
            {/* Entry title with dark mode text color */}
            <h1 className="font-bold text-sm md:text-lg text-gray-900 dark:text-gray-100">{entry.title}</h1>
            {/* Entry description with dark mode text color */}
            <p className="text-center text-lg font-light md:mt-2 md:mb-4 mt-1 mb-3 text-gray-700 dark:text-gray-300">
              {entry.description}
            </p>
            <section className="flex items-center justify-between flex-col md:flex-row pt-2 md:pt-0">
              <div className="flex justify-center">
                {/* Delete button with no specific dark mode changes */}
                <button
                  onClick={() => deleteEntry(entry.id as string)}
                  className="m-1 md:m-2 p-1 font-semibold rounded-md bg-red-500 hover:bg-red-700"
                >
                  ✖
                </button>
                {/* Edit button with no specific dark mode changes */}
                <button
                  onClick={() => navigate(`/edit/${entry.id}`, { replace: true })}
                  className="m-1 md:m-2 p-1 font-semibold rounded-md bg-blue-500 hover:bg-blue-700"
                >
                  🖊
                </button>
              </div>
              {/* Entry creation date with dark mode text color */}
              <time className="text-right text-sm md:text-lg text-gray-600 dark:text-gray-400">
                {new Date(entry.created_at.toString()).toLocaleDateString()}
              </time>
            </section>
          </div>
        );
      })}
    </section>
  );
}
