import React, { useState } from "react";

function currency(n) {
  if (!n && n !== 0) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(Number(n));
}

export default function DogSitterProDashboard() {
  // Données simulées (test)
  const [goalMonthly] = useState(2500);
  const [currentRevenue] = useState(1850);
  const [pendingRevenue] = useState(580);
  const [charges] = useState(620);
  const [clients] = useState([
    { name: "⭐ Sophie Martin", amount: 480 },
    { name: "⭐ Lucas & Max", amount: 380 },
    { name: "⚠️ Famille Durand", amount: 350, alert: true },
  ]);
  const [hours] = useState({ care: 25, travel: 10, admin: 5 });

  // Calculs
  const totalForecast = currentRevenue + pendingRevenue;
  const net = totalForecast - charges;
  const progress = Math.min((currentRevenue / goalMonthly) * 100, 100);
  const totalHours = hours.care + hours.travel + hours.admin;
  const hourlyRate = currentRevenue / totalHours;
  const travelRatio = Math.round((hours.travel / totalHours) * 100);

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
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-3">
          <h2 className="text-lg font-medium">💡 Ton mois en un coup d’œil</h2>
          <div className="flex justify-between items-center text-sm">
            <div>
              <div className="text-gray-500">Revenus encaissés</div>
              <div className="text-xl font-semibold">{currency(currentRevenue)}</div>
            </div>
            <div className="text-right">
              <div className="text-gray-500">Objectif</div>
              <div className="text-xl font-semibold">{currency(goalMonthly)}</div>
            </div>
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

        {/* Bloc 2 : Clients fiables */}
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-3">
          <h2 className="text-lg font-medium">👥 Tes clients fiables</h2>
          <ul className="text-sm space-y-2">
            {clients.map((c, idx) => (
              <li
                key={idx}
                className={`flex justify-between ${
                  c.alert ? "text-[#E68A00]" : "text-gray-700"
                }`}
              >
                <span>{c.name}</span>
                <span className="font-medium">{currency(c.amount)}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-600">
            Ces clients t’apportent 60 % de ton chiffre et 90 % de ta tranquillité 💚
          </p>
        </section>

        {/* Bloc 3 : Stabilité financière */}
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-3">
          <h2 className="text-lg font-medium">💰 Stabilité financière</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Reste à encaisser :</div>
            <div className="text-right font-medium">{currency(pendingRevenue)}</div>
            <div>Projection fin de mois :</div>
            <div className="text-right font-medium">{currency(totalForecast)}</div>
            <div>Charges estimées :</div>
            <div className="text-right font-medium text-gray-600">
              -{currency(charges)}
            </div>
          </div>
          <hr className="border-gray-200 my-2" />
          <div className="flex justify-between text-base font-semibold">
            <div>Net estimé :</div>
            <div>{currency(net)}</div>
          </div>
          <p className="text-sm text-gray-600">
            💚 Ton mois est sécurisé 🐶
          </p>
        </section>

        {/* Bloc 4 : Équilibre de vie */}
        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-3">
          <h2 className="text-lg font-medium">⚖️ Équilibre de vie</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Heures de garde :</div>
            <div className="text-right font-medium">{hours.care} h</div>
            <div>Heures de trajet :</div>
            <div className="text-right font-medium">
              {hours.travel} h{" "}
              {travelRatio > 20 && <span className="text-[#E68A00]">⚠️</span>}
            </div>
            <div>Heures d’admin :</div>
            <div className="text-right font-medium">{hours.admin} h</div>
            <div>Total :</div>
            <div className="text-right font-medium">{totalHours} h</div>
          </div>
          <div className="text-sm text-gray-600">
            Revenu horaire réel : <strong>{currency(hourlyRate)}/h</strong>
          </div>
          <p className="text-sm text-gray-600">
            💡 Tes {hours.travel}h de trajets = {travelRatio}% de ton temps.  
            Regrouper 2 clients du même quartier te libérerait environ 2h/semaine.
          </p>
        </section>

        {/* Footer doux */}
        <footer className="text-center text-xs text-gray-400 pt-4">
          💚 Ton calme est ta force. Prends soin de toi aussi 🐾
        </footer>
      </main>
    </div>
  );
}
