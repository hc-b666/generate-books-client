import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { BACKEND_URL } from "./constants";

export type Book = {
  id: number;
  isbn: string;
  title: string;
  authors: string[];
  publisher: string;
  likes: number;
  reviews: string[];
};

export type Lang = "en" | "pl" | "pt_BR";

export const langs = [
  { short: "en", long: "English" },
  { short: "pl", long: "Polish" },
  { short: "pt_BR", long: "Portuguese (Brazil)" },
];

export type AppContextType = {
  books: Book[];
  lang: Lang;
  seed: number;
  like: number;
  review: number;
  page: number;
  setLang: (lang: Lang) => void;
  setSeed: (seed: number) => void;
  setLike: (like: number) => void;
  setReview: (review: number) => void;
  setPage: (page: number) => void;
  langs: { short: string; long: string }[];
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [lang, setLang] = useState<Lang>("en");
  const [seed, setSeed] = useState(42);
  const [like, setLike] = useState(3.5);
  const [review, setReview] = useState(4.5);
  const [page, setPage] = useState(2);

  const getBooks = async () => {
    const res = await fetch(`${BACKEND_URL}?lang=${lang}&seed=${seed}&like=${like}&review=${review}&page=${page}`);
    const data = await res.json();
    setBooks(data);
  };

  useEffect(() => {
    getBooks();
  }, [lang, seed, like, review, page]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50) {
        setPage(p => p + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AppContext.Provider
      value={{
        books,
        lang,
        seed,
        like,
        review,
        page,
        setLang,
        setSeed,
        setLike,
        setReview,
        setPage,
        langs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
