import React, { useState } from "react";

function currency(n) {
  if (n === "" || n === null || n === undefined) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(Number(n));
}

export default function DogSitterProDashboard() {
  const [goalMonthly, setGoalMonthly] = useState(2500);
  const [currentRevenue, setCurrentRevenue] = useState(1850);
  const [pendingRevenue, setPendingRevenue] = useState(580);
  const [charges, setCharges] = useState(620);
  const [hoursCare, setHoursCare] = useState(25);
  const [hoursTravel, setHoursTravel] = useState(10);
  const [hoursAdmin, setHoursAdmin] = useState(5);

  const totalForecast = Number(currentRevenue) + Number(pendingRevenue);
  const net = totalForecast - Number(charges);
  const progress = Math.min((currentRevenue / goalMonthly) * 100, 100);
  const totalHours =
    Number(hoursCare) + Number(hoursTravel) + Number(hoursAdmin);
  const hourlyRate = currentRevenue / totalHours;
  const travelRatio = Math.round((hoursTravel / totalHours) * 100);

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-gray-800 font-sans antialiased flex flex-col items-center">
      <main className="w-full max-w-md px-6 py-8 space-y-6">
        {/* Header */}
        <header className="text-center space-y-1">
          <h1 className="text-2xl font-semibold">Sérénité du mois 🐾</h1>
          <p className="text-sm text-gray-500">
            Tu avances bien, voici où tu en es.
          </p>
        </header>

        {/* Bloc 1 : Ton mois */}
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-4">
          <h2 className="text-lg font-medium">💡 Ton mois en un coup d’œil</h2>

          <div className="space-y-2 text-sm">
            <label className="flex justify-between items-center">
              <span>Revenus encaissés :</span>
              <input
                type="number"
                value={currentRevenue}
                onChange={(e) => setCurrentRevenue(e.target.value)}
                className="w-24 border border-gray-300 rounded-md text-right px-2 py-1"
              />
            </label>
            <label className="flex justify-between items-center">
              <span>Objectif mensuel :</span>
              <input
                type="number"
                value={goalMonthly}
                onChange={(e) => setGoalMonthly(e.target.value)}
                className="w-24 border border-gray-300 rounded-md text-right px-2 py-1"
              />
            </label>
          </div>

          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-2">
            <div
              className="h-2 bg-gray-700 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            Tu as déjà atteint {Math.round(progress)} % de ton objectif, bravo 👏
          </p>
        </section>

        {/* Bloc 2 : Stabilité financière */}
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-4">
          <h2 className="text-lg font-medium">💰 Stabilité financière</h2>

          <div className="space-y-2 text-sm">
            <label className="flex justify-between items-center">
              <span>Reste à encaisser :</span>
              <input
                type="number"
                value={pendingRevenue}
                onChange={(e) => setPendingRevenue(e.target.value)}
                className="w-24 border border-gray-300 rounded-md text-right px-2 py-1"
              />
            </label>
            <label className="flex justify-between items-center">
              <span>Charges estimées :</span>
              <input
                type="number"
                value={charges}
                onChange={(e) => setCharges(e.target.value)}
                className="w-24 border border-gray-300 rounded-md text-right px-2 py-1"
              />
            </label>
          </div>

          <hr className="border-gray-200 my-2" />

          <div className="flex justify-between text-sm">
            <span>Projection fin de mois :</span>
            <span className="font-semibold">{currency(totalForecast)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Net estimé :</span>
            <span>{currency(net)}</span>
          </div>
          <p className="text-sm text-gray-600">💚 Ton mois est sécurisé 🐶</p>
        </section>

        {/* Bloc 3 : Équilibre de vie */}
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-4">
          <h2 className="text-lg font-medium">⚖️ Équilibre de vie</h2>

          <div className="space-y-2 text-sm">
            <label className="flex justify-between items-center">
              <span>Heures de garde :</span>
              <input
                type="number"
                value={hoursCare}
                onChange={(e) => setHoursCare(e.target.value)}
                className="w-20 border border-gray-300 rounded-md text-right px-2 py-1"
              />
            </label>
            <label className="flex justify-between items-center">
              <span>Heures de trajet :</span>
              <input
                type="number"
                value={hoursTravel}
                onChange={(e) => setHoursTravel(e.target.value)}
                className="w-20 border border-gray-300 rounded-md text-right px-2 py-1"
              />
            </label>
            <label className="flex justify-between items-center">
              <span>Heures d’admin :</span>
              <input
                type="number"
                value={hoursAdmin}
                onChange={(e) => setHoursAdmin(e.target.value)}
                className="w-20 border border-gray-300 rounded-md text-right px-2 py-1"
              />
            </label>
          </div>

          <div className="text-sm text-gray-600">
            Total : <strong>{totalHours} h</strong> — Revenu horaire :{" "}
            <strong>{currency(hourlyRate)}/h</strong>
          </div>
          <p className="text-sm text-gray-600">
            💡 Tes {hoursTravel}h de trajets = {travelRatio}% de ton temps.  
            Regrouper 2 clients du même quartier te libérerait ~2h/semaine.
          </p>
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-400 pt-4">
          💚 Ton calme est ta force. Prends soin de toi aussi 🐾
        </footer>
      </main>
    </div>
  );
}
