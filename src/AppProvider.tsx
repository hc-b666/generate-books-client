import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { BACKEND_URL } from "./constants";
import { debounce } from "lodash";

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

export const langs: { short: Lang; long: string }[] = [
  { short: "en", long: "English" },
  { short: "pl", long: "Polish" },
  { short: "pt_BR", long: "Portuguese (Brazil)" },
];

export type AppContextType = {
  books: Book[];
  lang: Lang;
  seed: string;
  like: string;
  review: string;
  page: number;
  setLang: (lang: Lang) => void;
  setSeed: (seed: string) => void;
  setLike: (like: string) => void;
  setReview: (review: string) => void;
  setPage: (page: number) => void;
  langs: { short: Lang; long: string }[];
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
  const [seed, setSeed] = useState("42");
  const [like, setLike] = useState("3.5");
  const [review, setReview] = useState("4.5");
  const [page, setPage] = useState(2);

  const getBooks = async (p: number) => {
    const res = await fetch(`${BACKEND_URL}?lang=${lang}&seed=${seed}&like=${like}&review=${review}&page=${p}`);
    const data = await res.json();
    setBooks(p => [...p, ...data]);
  };

  useEffect(() => {
    const fetchData = async () => {
      setBooks([]);
      for (let p = 1; p <= page; p++) {
        await getBooks(p);
      }
    };

    fetchData();
  }, [lang, seed, like, review]);

  useEffect(() => {
    getBooks(page + 1);
  }, [page]);

  useEffect(() => {
    const handleScroll = debounce(() => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50) {
        setPage(p => p + 1);
      }
    }, 300);
  
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
