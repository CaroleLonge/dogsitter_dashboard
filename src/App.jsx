import React, { useMemo, useState, useEffect } from "react";

// DogSitterPro Dashboard — Prototype v0
// Mobile-first, single-file React component with TailwindCSS
// - Form inputs (objectifs, revenus, clients, heures)
// - 3 blocs d'insights (Finances, Clients, Équilibre)
// - Suggestions textuelles et ton bienveillant
// - Sauvegarde locale (localStorage)
// - Données d'exemple et reset
// - Impression / Export PDF (via fenêtre d'impression)

function currency(n) {
  if (n === null || n === undefined || isNaN(n)) return "—";
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(Number(n));
}

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

const exampleData = {
  goalMonthly: 2500,
  currentRevenue: 1847,
  avgJobPrice: 45,
  hours: { care: 28, travel: 12, admin: 6 },
  clients: [
    { name: "Sophie Martin", amount: 480, paysOnTime: true, latePayments: 0, cancels: 0 },
    { name: "Lucas & Max", amount: 380, paysOnTime: true, latePayments: 1, cancels: 0 },
    { name: "Famille Durand", amount: 350, paysOnTime: false, latePayments: 2, cancels: 3 },
    { name: "Charly (bouledogue)", amount: 320, paysOnTime: true, latePayments: 0, cancels: 1 },
    { name: "Tao (Shiba)", amount: 317, paysOnTime: true, latePayments: 0, cancels: 0 },
  ],
};

export default function DogSitterProDashboard() {
  const [goalMonthly, setGoalMonthly] = useState(2000);
  const [currentRevenue, setCurrentRevenue] = useState(0);
  const [avgJobPrice, setAvgJobPrice] = useState(30);
  const [hours, setHours] = useState({ care: 0, travel: 0, admin: 0 });
  const [clients, setClients] = useState([
    { name: "", amount: 0, paysOnTime: true, latePayments: 0, cancels: 0 },
  ]);
  const [showForm, setShowForm] = useState(true);

  // Load / Save local
  useEffect(() => {
    const saved = localStorage.getItem("dsp_dash_v0");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setGoalMonthly(parsed.goalMonthly ?? 2000);
        setCurrentRevenue(parsed.currentRevenue ?? 0);
        setAvgJobPrice(parsed.avgJobPrice ?? 30);
        setHours(parsed.hours ?? { care: 0, travel: 0, admin: 0 });
        setClients(parsed.clients?.length ? parsed.clients : clients);
      } catch (e) {}
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const payload = { goalMonthly, currentRevenue, avgJobPrice, hours, clients };
    localStorage.setItem("dsp_dash_v0", JSON.stringify(payload));
  }, [goalMonthly, currentRevenue, avgJobPrice, hours, clients]);

  // Derived values
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-index
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dayOfMonth = now.getDate();
  const monthProgress = dayOfMonth / daysInMonth; // 0..1

  const revenuePct = goalMonthly ? clamp(currentRevenue / goalMonthly, 0, 1) : 0;
  const remainingRevenue = Math.max(goalMonthly - currentRevenue, 0);
  const projected = currentRevenue / Math.max(monthProgress, 0.0001);

  const neededJobs = avgJobPrice > 0 ? Math.ceil(remainingRevenue / avgJobPrice) : null;

  const totalHours = (Number(hours.care) || 0) + (Number(hours.travel) || 0) + (Number(hours.admin) || 0);
  const realHourlyRate = totalHours > 0 ? currentRevenue / totalHours : 0;
  const travelShare = totalHours > 0 ? hours.travel / totalHours : 0;

  const topClients = useMemo(() => {
    const list = [...clients]
      .filter(c => c.name?.trim() && !isNaN(Number(c.amount)))
      .sort((a, b) => Number(b.amount) - Number(a.amount))
      .slice(0, 5);
    return list;
  }, [clients]);

  const adminHeavies = topClients.filter(c => (c.latePayments || 0) >= 2 || (c.cancels || 0) >= 2 || c.paysOnTime === false);

  // Suggestions
  const suggestionFinance = goalMonthly > 0
    ? currentRevenue >= goalMonthly
      ? `Bravo 👏 Tu as atteint ${Math.round(revenuePct * 100)}% de ton objectif. Tu peux sécuriser la trésorerie du mois prochain en planifiant dès maintenant 2 à 3 prestations.`
      : `À ce rythme, tu finirais autour de ${currency(projected)}. Il te manque ${currency(remainingRevenue)} — soit ${neededJobs ?? "—"} prestation(s) à ${currency(avgJobPrice)}.`
    : `Définis un objectif mensuel pour obtenir des projections.`;

  const suggestionClients = adminHeavies.length
    ? `${adminHeavies[0].name} génère du stress admin (retards/annulations). Envisage d'ajuster tes conditions (acompte, fenêtre d'annulation).`
    : `Tes clients phares te paient dans les temps 👍 Pense à leur proposer un pack fidélité (x5 promenades).`;

  const suggestionBalance = totalHours > 40
    ? `Tu travailles ${Math.round(totalHours)}h sur la période. Pense à regrouper les visites par zone pour réduire tes ${Math.round(travelShare * 100)}% d'heures de trajet.`
    : travelShare > 0.3
      ? `Tes trajets pèsent ${Math.round(travelShare * 100)}% de ton temps. Essaie de regrouper les clients par quartier ou d'ajuster tes créneaux.`
      : `Beau rythme 👌 Continue à réserver 30 min par jour pour l'admin afin d'éviter l'effet "dimanche soir".`;

  // Handlers
  const updateClient = (idx, field, value) => {
    setClients(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

  const addClient = () => {
    setClients(prev => [...prev, { name: "", amount: 0, paysOnTime: true, latePayments: 0, cancels: 0 }]);
  };

  const removeClient = (idx) => {
    setClients(prev => prev.filter((_, i) => i !== idx));
  };

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
    setClients([{ name: "", amount: 0, paysOnTime: true, latePayments: 0, cancels: 0 }]);
  };

  const printPDF = () => window.print();

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-xl p-4 sm:p-6">
        <header className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">DogSitterPro — Dashboard (prototype)</h1>
          <p className="text-neutral-300 mt-1">Visualiser → Conscientiser → Agir. Test mobile-first pour Morgane & co.</p>
        </header>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={() => setShowForm(v => !v)} className="px-3 py-2 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-sm">{showForm ? "Masquer" : "Afficher"} la saisie</button>
          <button onClick={loadExample} className="px-3 py-2 rounded-2xl bg-blue-700 hover:bg-blue-600 text-sm">Charger données d'exemple</button>
          <button onClick={resetAll} className="px-3 py-2 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-sm">Réinitialiser</button>
          <button onClick={printPDF} className="px-3 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-sm">Imprimer / PDF</button>
        </div>

        {/* Form */}
        {showForm && (
          <section className="mb-6 rounded-3xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-5">
            <h2 className="text-lg font-semibold mb-3">Saisie rapide</h2>

            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">Objectif mensuel</label>
                  <input type="number" inputMode="decimal" className="w-full rounded-xl bg-neutral-800 px-3 py-2" value={goalMonthly} onChange={(e) => setGoalMonthly(Number(e.target.value))}/>
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">Revenus du mois (à date)</label>
                  <input type="number" inputMode="decimal" className="w-full rounded-xl bg-neutral-800 px-3 py-2" value={currentRevenue} onChange={(e) => setCurrentRevenue(Number(e.target.value))}/>
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">Prix moyen d'une prestation</label>
                  <input type="number" inputMode="decimal" className="w-full rounded-xl bg-neutral-800 px-3 py-2" value={avgJobPrice} onChange={(e) => setAvgJobPrice(Number(e.target.value))}/>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">Heures garde (période)</label>
                  <input type="number" inputMode="decimal" className="w-full rounded-xl bg-neutral-800 px-3 py-2" value={hours.care} onChange={(e) => setHours(h => ({ ...h, care: Number(e.target.value) }))}/>
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">Heures trajet</label>
                  <input type="number" inputMode="decimal" className="w-full rounded-xl bg-neutral-800 px-3 py-2" value={hours.travel} onChange={(e) => setHours(h => ({ ...h, travel: Number(e.target.value) }))}/>
                </div>
                <div>
                  <label className="block text-sm text-neutral-300 mb-1">Heures admin</label>
                  <input type="number" inputMode="decimal" className="w-full rounded-xl bg-neutral-800 px-3 py-2" value={hours.admin} onChange={(e) => setHours(h => ({ ...h, admin: Number(e.target.value) }))}/>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Clients (max 5)</h3>
                  <button onClick={addClient} className="text-sm px-2 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-700">Ajouter</button>
                </div>
                <div className="space-y-3">
                  {clients.map((c, idx) => (
                    <div key={idx} className="rounded-2xl border border-neutral-800 p-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <label className="block text-xs text-neutral-400">Nom</label>
                          <input className="w-full rounded-xl bg-neutral-800 px-3 py-2 mb-2" value={c.name} onChange={(e) => updateClient(idx, "name", e.target.value)} placeholder="Ex: Famille Durand"/>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-xs text-neutral-400">Montant (période)</label>
                              <input type="number" inputMode="decimal" className="w-full rounded-xl bg-neutral-800 px-3 py-2" value={c.amount} onChange={(e) => updateClient(idx, "amount", Number(e.target.value))}/>
                            </div>
                            <div>
                              <label className="block text-xs text-neutral-400">Retards paiement</label>
                              <input type="number" className="w-full rounded-xl bg-neutral-800 px-3 py-2" value={c.latePayments} onChange={(e) => updateClient(idx, "latePayments", Number(e.target.value))}/>
                            </div>
                            <div>
                              <label className="block text-xs text-neutral-400">Annulations</label>
                              <input type="number" className="w-full rounded-xl bg-neutral-800 px-3 py-2" value={c.cancels} onChange={(e) => updateClient(idx, "cancels", Number(e.target.value))}/>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-sm">
                            <input id={`pays-${idx}`} type="checkbox" checked={c.paysOnTime} onChange={(e) => updateClient(idx, "paysOnTime", e.target.checked)} />
                            <label htmlFor={`pays-${idx}`}>Paie à temps</label>
                          </div>
                        </div>
                        {clients.length > 1 && (
                          <button onClick={() => removeClient(idx)} className="text-xs px-2 py-1 rounded-lg bg-red-700 hover:bg-red-600 h-8">Retirer</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Dashboard blocks */}
        <section className="space-y-5 print:space-y-4">
          {/* Bloc 1: Finances */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 mb-2">
              <h2 className="text-lg font-semibold">📊 Ce mois-ci</h2>
              <span className="text-xs text-neutral-400">Jour {dayOfMonth}/{daysInMonth}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm sm:text-base">
              <div>Revenus actuels : <strong>{currency(currentRevenue)}</strong></div>
              <div>Objectif mensuel : <strong>{currency(goalMonthly)}</strong></div>
              <div>Reste à faire : <strong>{currency(remainingRevenue)}</strong></div>
              <div>Projection fin de mois : <strong>{currency(projected)}</strong></div>
            </div>
            <div className="mt-3 h-3 w-full rounded-full bg-neutral-800 overflow-hidden">
              <div className="h-full bg-emerald-600" style={{ width: `${revenuePct * 100}%` }} />
            </div>
            <p className="mt-3 text-sm text-neutral-200 leading-relaxed">💡 {suggestionFinance}</p>
          </div>

          {/* Bloc 2: Clients */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-5">
            <h2 className="text-lg font-semibold mb-3">👥 Top 5 clients (période)</h2>
            <div className="space-y-2">
              {topClients.length === 0 && (
                <p className="text-neutral-400 text-sm">Ajoute au moins un client pour voir l'analyse.</p>
              )}
              {topClients.map((c, i) => (
                <div key={i} className="rounded-2xl border border-neutral-800 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">{i + 1}. {c.name || "(Sans nom)"}</div>
                    <div className="opacity-90">{currency(c.amount)}</div>
                  </div>
                  <div className="mt-1 text-xs text-neutral-300">
                    {c.paysOnTime ? "Paie à temps" : "Paiements irréguliers"}
                    {(c.latePayments || 0) > 0 ? ` • ${c.latePayments} retard(s)` : ""}
                    {(c.cancels || 0) > 0 ? ` • ${c.cancels} annulation(s)` : ""}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-neutral-200 leading-relaxed">💡 {suggestionClients}</p>
          </div>

          {/* Bloc 3: Équilibre */}
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-5">
            <h2 className="text-lg font-semibold mb-3">🕐 Ta semaine en chiffres (ou période saisie)</h2>
            <div className="grid grid-cols-2 gap-3 text-sm sm:text-base">
              <div>Heures de garde : <strong>{Number(hours.care) || 0}h</strong></div>
              <div>Heures de trajet : <strong>{Number(hours.travel) || 0}h</strong></div>
              <div>Heures d'admin : <strong>{Number(hours.admin) || 0}h</strong></div>
              <div>Total travaillé : <strong>{totalHours}h</strong></div>
            </div>
            <div className="mt-2 text-sm">Revenu horaire réel : <strong>{realHourlyRate ? `${currency(realHourlyRate)}/h` : "—"}</strong></div>
            <p className="mt-3 text-sm text-neutral-200 leading-relaxed">💡 {suggestionBalance}</p>
          </div>
        </section>

        {/* Footer note */}
        <footer className="mt-6 text-center text-xs text-neutral-500">
          Prototype v0 — conçu pour tests rapides avec des dogsitters. Pense à noter ce qui surprend, ce qui donne envie d'agir, et ce qui manque.
        </footer>
      </div>
    </div>
  );
}
