// wordsearch.js
// Interactive Word Search — Grade 12 Life Sciences
// Works with index.html and TailwindCSS style.css

const { useState, useEffect, useRef } = React;

function WordSearchApp() {
  const GRID = [
    "PHOTOSYNTHESISA",
    "RGENOTYPEELLECM",
    "OLNITATUMMITOSI",
    "TCHLOROPLASTTEO",
    "EROSMOSISPHENOT",
    "IALLELEMRIBOSOM",
    "NDIFFUSIONNUCLE",
    "SYENZYMETRANSLA",
    "CHROMOSOMEHOMEO",
    "RETRANSCRIPTION",
    "IMEIOSISPROTEIN",
    "POHGENEPLASMCSN",
    "TISISOTIMOMMTLU",
    "IOODNITEIDONNAA",
    "OSYSENIPLANRTRC"
  ];

  const ROWS = GRID.length;
  const COLS = GRID[0].length;

  const WORDS = [
    "MITOSIS",
    "MEIOSIS",
    "CHROMOSOME",
    "RIBOSOME",
    "ENZYME",
    "OSMOSIS",
    "DIFFUSION",
    "NUCLEOTIDE",
    "GENOTYPE",
    "PHENOTYPE",
    "MUTATION",
    "HOMEOSTASIS",
    "PHOTOSYNTHESIS",
    "TRANSCRIPTION",
    "TRANSLATION",
    "ALLELE",
    "PROTEIN",
    "CHLOROPLAST",
    "CELL",
    "GENE"
  ];

  const letters = GRID.join("").split("");
  const idx = (r, c) => r * COLS + c;
  const rc = (i) => [Math.floor(i / COLS), i % COLS];

  const [selected, setSelected] = useState([]);
  const [found, setFound] = useState([]);
  const mouseDownRef = useRef(false);
  const startRef = useRef(null);

  useEffect(() => {
    const onUp = () => {
      if (mouseDownRef.current) {
        mouseDownRef.current = false;
        if (selected.length) checkSelection(selected);
        setSelected([]);
        startRef.current = null;
      }
    };
    window.addEventListener("mouseup", onUp);
    return () => window.removeEventListener("mouseup", onUp);
  }, [selected]);

  function selectionString(sel) {
    return sel.map((i) => letters[i]).join("");
  }

  function checkSelection(sel) {
    if (!sel.length) return;
    const s = selectionString(sel);
    const sRev = s.split("").reverse().join("");
    const remaining = WORDS.filter((w) => !found.some((f) => f.word === w));
    for (const w of remaining) {
      if (s === w || sRev === w) {
        setFound((prev) => [...prev, { word: w, indices: [...sel] }]);
        return;
      }
    }
  }

  function handleMouseDown(i) {
    mouseDownRef.current = true;
    startRef.current = i;
    setSelected([i]);
  }

  function handleMouseEnter(i) {
    if (!mouseDownRef.current || startRef.current === null) return;
    const [sr, sc] = rc(startRef.current);
    const [er, ec] = rc(i);
    const dr = er - sr;
    const dc = ec - sc;
    const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
    const stepC = dc === 0 ? 0 : dc / Math.abs(dc);
    if (stepR !== 0 && stepC !== 0 && Math.abs(dr) !== Math.abs(dc)) return;
    const len = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
    const newSel = [];
    for (let k = 0; k < len; k++) {
      const r = sr + k * stepR;
      const c = sc + k * stepC;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS) break;
      newSel.push(idx(r, c));
    }
    setSelected(newSel);
  }

  function inFound(i) {
    return found.some((f) => f.indices.includes(i));
  }

  function revealAll() {
    const dirs = [
      [0, 1], [1, 0], [0, -1], [-1, 0],
      [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];
    const results = [];
    for (const w of WORDS) {
      if (results.some((r) => r.word === w)) continue;
      let foundPath = null;
      for (let r = 0; r < ROWS && !foundPath; r++) {
        for (let c = 0; c < COLS && !foundPath; c++) {
          for (const d of dirs) {
            const path = [];
            let rr = r;
            let cc = c;
            let k;
            for (k = 0; k < w.length; k++) {
              if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) break;
              path.push(idx(rr, cc));
              if (letters[idx(rr, cc)] !== w[k]) break;
              rr += d[0];
              cc += d[1];
            }
            if (k === w.length) {
              foundPath = path;
              break;
            }
            // reversed
            rr = r; cc = c;
            const revPath = [];
            for (k = 0; k < w.length; k++) {
              if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) break;
              revPath.push(idx(rr, cc));
              if (letters[idx(rr, cc)] !== w.split("").reverse().join("")[k]) break;
              rr += d[0]; cc += d[1];
            }
            if (k === w.length) { foundPath = revPath; break; }
          }
        }
      }
      if (foundPath) results.push({ word: w, indices: foundPath });
    }
    setFound(results);
  }

  function resetAll() {
    setFound([]);
    setSelected([]);
    startRef.current = null;
    mouseDownRef.current = false;
  }

  return (
    <div className="p-4 max-w-5xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-2">Interactive Word Search — Grade 12 Life Sciences</h1>
      <p className="mb-4 text-sm">Click/tap the first letter, drag to the last letter, then release. Works on desktop & mobile.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div
              className="grid gap-0"
              style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))`, userSelect: "none" }}
            >
              {letters.map((ch, i) => {
                const isSelected = selected.includes(i);
                const isFound = inFound(i);
                const cellClass = isFound ? "bg-green-300" : isSelected ? "bg-yellow-300" : "bg-white hover:bg-gray-100";
                return (
                  <div
                    key={i}
                    data-idx={i}
                    onMouseDown={() => handleMouseDown(i)}
                    onMouseEnter={() => handleMouseEnter(i)}
                    onTouchStart={(e) => { e.preventDefault(); handleMouseDown(i); }}
                    onTouchMove={(e) => {
                      e.preventDefault();
                      const touch = e.touches[0];
                      const target = document.elementFromPoint(touch.clientX, touch.clientY);
                      if (!target) return;
                      const idxAttr = target.getAttribute("data-idx");
                      if (!idxAttr) return;
                      const ni = parseInt(idxAttr, 10);
                      handleMouseEnter(ni);
                    }}
                    onTouchEnd={() => {
                      mouseDownRef.current = false;
                      if (selected.length) checkSelection(selected);
                      setSelected([]);
                    }}
                    className={`border border-gray-200 text-center select-none p-2 leading-4 text-sm font-mono cursor-pointer ${cellClass}`}
                  >
                    {ch}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <button onClick={revealAll} className="px-3 py-2 bg-blue-600 text-white rounded">Reveal all</button>
            <button onClick={resetAll} className="px-3 py-2 bg-gray-700 text-white rounded">Reset</button>
            <div className="ml-auto text-sm text-gray-600 self-center">Found: {found.length}/{WORDS.length}</div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="font-semibold mb-2">Word List</h2>
          <ul className="grid grid-cols-1 gap-1 text-sm">
            {WORDS.map((w) => {
              const isFound = found.some((f) => f.word === w);
              return <li key={w} className={`p-1 rounded ${isFound ? "line-through text-gray-500" : ""}`}>{w}</li>;
            })}
          </ul>

          <div className="mt-4 text-xs text-gray-600">
            Tips:
            <ul className="list-disc list-inside">
              <li>Click or tap the first letter, drag to the last, then release.</li>
              <li>Words may be horizontal, vertical, diagonal or backward.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 text-right text-xs text-gray-500">Made for Catalyst Learning Hub</div>
    </div>
  );
}

// Render app
const rootEl = document.getElementById("root");
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(<WordSearchApp />);
}
