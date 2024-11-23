import { useState } from "react";
import { useAppContext } from "./AppProvider";
import { BookAccordion } from "./components/BookAccordion";
import Navbar from "./components/Navbar";

export function App() {
  const { books } = useAppContext();
  const [openBook, setBook] = useState<number | null>(null);
  const [view, setView] = useState<"table" | "grid">("table");

  return (
    <div className="w-full min-h-screen flex flex-col gap-10">
      <Navbar view={view} setView={setView} />

      <main className="container flex flex-col gap-1">
        {books.map((book) => (
          <BookAccordion openBook={openBook} setBook={setBook} key={book.id} book={book} />
        ))}
      </main>
    </div>
  );
}

