import { Shuffle } from "@/icons/Shuffle";
import Select from "./Select";
import { Lang, useAppContext } from "@/AppProvider";
import { TableIcon } from "@/icons/TableIcon";
import { GridIcon } from "@/icons/GridIcon";
import seedrandom from "seedrandom";

interface NavbarProps {
  view: "table" | "grid";
  setView: (view: "table" | "grid") => void;
}

export default function Navbar({ view, setView }: NavbarProps) {
  const {
    langs,
    lang,
    setLang,
    seed,
    setSeed,
    like,
    setLike,
    review,
    setReview,
  } = useAppContext();

  const langChange = (val: string) => {
    const selectedLang = langs.find((l) => l.long === val)?.short as string;
    setLang(selectedLang as Lang);
  };

  const langValue = langs.find((l) => l.short === lang)?.long as string;

  const generateRandomSeed = () => {
    const min = 1;
    const max = 999999;
    const rng = seedrandom();
    const randomSeed = Math.floor(rng() * (max - min + 1)) + min;
    setSeed(randomSeed.toString());
  };

  return (
    <nav className="container py-3 flex items-center justify-between">
      <Select
        options={langs.map((l) => l.long)}
        value={langValue}
        onChange={langChange}
      />

      <div className="w-[240px] relative">
        <input
          type="text"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          className="w-full h-full p-1 border border-gray-500 rounded"
        />

        <button onClick={generateRandomSeed} className="hover:bg-gray-200 p-1 rounded absolute right-1 top-1/2 -translate-y-1/2">
          <Shuffle w={16} h={16} />
        </button>
      </div>

      <div className="w-[240px]">
        <input
          type="text"
          value={like}
          onChange={(e) => setLike(e.target.value)}
          className="w-full h-full p-1 border border-gray-500 rounded"
        />
      </div>

      <div className="w-[240px]">
        <input
          type="text"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full h-full p-1 border border-gray-500 rounded"
        />
      </div>

      <div className="flex items-center">
        <button onClick={() => setView("table")} className={`py-1 px-2 rounded-tl-lg rounded-bl-lg ${view === "table" && "bg-blue-500 text-white"}`}>
          <TableIcon />
        </button>
        <button onClick={() => setView("grid")} className={`py-1 px-2 rounded-tr-lg rounded-br-lg ${view === "grid" && "bg-blue-500 text-white"}`}>
          <GridIcon />
        </button>
      </div>
    </nav>
  );
}
