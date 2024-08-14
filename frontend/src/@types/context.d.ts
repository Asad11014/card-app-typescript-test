export interface Entry {
  id?: string;
  title: string;
  description: string;
  created_at: Date | string;
}
export type EntryContextType = {
  entries: Entry[];
  saveEntry: (entry: Entry) => void;
  updateEntry: (id: string, entryData: Entry) => void;
  deleteEntry: (id: string) => void;
  theme: 'light' | 'dark'; //new theme state
  toggleTheme: () => void; //function to toggle the theme
};
