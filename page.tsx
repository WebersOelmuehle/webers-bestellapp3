import { categories } from '../lib/articles';
import PinGate from '../components/pin-gate';

export default function Page() {
  return (
    <main className="container vstack">
      <PinGate />
      <div className="card">
        <div style={{fontSize:18,fontWeight:800, marginBottom:6}}>Kategorien</div>
        <div className="small">Tippe eine Kategorie an, wähle Artikel & Mengen, dann absenden. Du bekommst E‑Mail + PDF.</div>
      </div>

      <div className="grid">
        {categories.map(cat => (
          <a key={cat} className="card" href={`/k/${encodeURIComponent(cat)}`}>
            <div style={{fontWeight:800}}>{cat}</div>
            <div className="small">Artikel anzeigen →</div>
          </a>
        ))}
      </div>
    </main>
  );
}
