import React, { useMemo, useState, useEffect } from "react";

// DogSitterPro — Interface Notion-like v1
// Style : blanc cassé, texte gris foncé, épuré et mobile-first

function currency(n) {
  if (!n && n !== 0) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(Number(n));
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

const exampleData = {
  goalMonthly: 2500,
  currentRevenue: 1847,
  avgJobPrice: 45,
  hours: { care: 28, travel: 12, admin: 6 },
  clients: [
    { name: "Sophie Martin", amount: 480, paysOnTime: true, latePayments: 0, cancels: 0 },
    { name: "Lucas & Max", amount: 380, paysOnTime: true, latePayments: 1, cancels: 0 },
    { name: "Famille Durand", amount: 350, paysOnTime: false, latePayments: 2, cancels: 3 },
  ],
};

export default function DogSitterProDashboard() {
  const [goalMonthly, setGoalMonthly] = useState(2000);
  const [currentRevenue, setCurrentRevenue] = useState(0);
  const [avgJobPrice, setAvgJobPrice] = useState(30);
  const [hours, setHours] = useState({ care: 0, travel: 0, admin: 0 });
  const [clients, setClients] = useState([{ name: "", amount: 0 }]);
  const [showForm, setShowForm] = useState(true);

  // Sauvegarde locale
  useEffect(() => {
    const saved = localStorage.getItem("dsp_v1");
    if (saved) {
      const parsed = JSON.parse(saved);
      setGoalMonthly(parsed.goalMonthly ?? 2000);
      setCurrentRevenue(parsed.currentRevenue ?? 0);
      setAvgJobPrice(parsed.avgJobPrice ?? 30);
      setHours(parsed.hours ?? { care: 0, travel: 0, admin: 0 });
      setClients(parsed.clients ?? []);
    }
  }, []);

  useEffect(() => {
    const payload = { goalMonthly, currentRevenue, avgJobPrice, hours, clients };
    localStorage.setItem("dsp_v1", JSON.stringify(payload));
  }, [goalMonthly, currentRevenue, avgJobPrice, hours, clients]);

  // Calculs
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const progress = now.getDate() / daysInMonth;
  const revenuePct = goalMonthly ? clamp(currentRevenue / goalMonthly, 0, 1) : 0;
  const remaining = Math.max(goalMonthly - currentRevenue, 0);
  const projected = currentRevenue / Math.max(progress, 0.001);
  const neededJobs = avgJobPrice > 0 ? Math.ceil(remaining / avgJobPrice) : 0;

  const totalHours = (hours.care || 0) + (hours.travel || 0) + (hours.admin || 0);
  const realRate = totalHours > 0 ? currentRevenue / totalHours : 0;

  const suggestion =
    currentRevenue >= goalMonthly
      ? `Bravo 👏 Tu as atteint ton objectif. Tu peux planifier ton prochain mois sereinement.`
      : `Il te manque ${currency(remaining)} — soit environ ${neededJobs} prestation(s) pour atteindre ton objectif.`;

  const suggestionBalance =
    totalHours > 40
      ? `Tu travailles ${totalHours}h cette période. Peut-être regrouper les visites pour réduire les trajets ?`
      : `Beau rythme 👌 Continue à réserver un peu de temps pour toi et ton admin.`;

  const loadExample = () => {
    setGoalMonthly(exampleData.goalMonthly);
    setCurrentRevenue(exampleData.currentRevenue);
    setAvgJobPrice(exampleData.avgJobPrice);
    setHours(exampleData.hours);
    setClients(exampleData.clients);
  };

  const resetAll = () => {
    setGoalMonthly(2000);
    setCurrentRevenue(0);
    setAvgJobPrice(30);
    setHours({ care: 0, travel: 0, admin: 0 });
    setClients([{ name: "", amount: 0 }]);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-gray-800 font-sans antialiased">
      <main className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        <header className="text-center space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Mon activité mensuelle de DogSitter 🐾
          </h1>
          <p className="text-sm text-gray-500">
            Je t’aide à avoir une vision de ton mois de gardes.
          </p>
        </header>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 justify-center">
          <button onClick={() => setShowForm(!showForm)} className="px-3 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-sm">
            {showForm ? "Masquer la saisie" : "Afficher la saisie"}
          </button>
          <button onClick={loadExample} className="px-3 py-2 rounded-xl bg-gray-800 text-white text-sm hover:bg-gray-700">
            Charger un exemple
          </button>
          <button onClick={resetAll} className="px-3 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-sm">
            Réinitialiser
          </button>
        </div>

        {/* Formulaire */}
        {showForm && (
          <section className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <h2 className="text-base font-medium text-gray-700">Données de ton mois</h2>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-gray-500">Objectif mensuel (€)</span>
                <input
                  type="number"
                  className="mt-1 w-full rounded-lg border-gray-300 focus:ring-1 focus:ring-gray-400 p-2"
                  value={goalMonthly}
                  onChange={(e) => setGoalMonthly(Number(e.target.value))}
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-500">Revenus actuels (€)</span>
                <input
                  type="number"
                  className="mt-1 w-full rounded-lg border-gray-300 focus:ring-1 focus:ring-gray-400 p-2"
                  value={currentRevenue}
                  onChange={(e) => setCurrentRevenue(Number(e.target.value))}
                />
              </label>
              <label className="block col-span-2">
                <span className="text-sm text-gray-500">Prix moyen d’une prestation (€)</span>
                <input
                  type="number"
                  className="mt-1 w-full rounded-lg border-gray-300 focus:ring-1 focus:ring-gray-400 p-2"
                  value={avgJobPrice}
                  onChange={(e) => setAvgJobPrice(Number(e.target.value))}
                />
              </label>
            </div>
          </section>
        )}

        {/* Dashboard */}
        <section className="space-y-5">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h2 className="text-lg font-medium">💰 Revenu mensuel</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Revenus : <strong>{currency(currentRevenue)}</strong></div>
              <div>Objectif : <strong>{currency(goalMonthly)}</strong></div>
              <div>Reste : <strong>{currency(remaining)}</strong></div>
              <div>Projection : <strong>{currency(projected)}</strong></div>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="h-2 bg-gray-700" style={{ width: `${revenuePct * 100}%` }}></div>
            </div>
            <p className="text-sm text-gray-600">{suggestion}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h2 className="text-lg font-medium">⚖️ Équilibre de vie</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Heures garde : <strong>{hours.care}h</strong></div>
              <div>Heures trajet : <strong>{hours.travel}h</strong></div>
              <div>Heures admin : <strong>{hours.admin}h</strong></div>
              <div>Total : <strong>{totalHours}h</strong></div>
            </div>
            <div className="text-sm text-gray-600">
              Revenu horaire : <strong>{realRate ? `${currency(realRate)}/h` : "—"}</strong>
            </div>
            <p className="text-sm text-gray-600">{suggestionBalance}</p>
          </div>
        </section>

        <footer className="text-center text-xs text-gray-400 pt-6">
          Prototype par Carole Longe
        </footer>
      </main>
    </div>
  );
}
