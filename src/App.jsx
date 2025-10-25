import React, { useState, useMemo } from "react";

/**
 * DogSitter — Sérénité du mois (Alan-like)
 * - Mobile-first, marges latérales confortables
 * - Inputs visibles (fond gris doux), résultats hiérarchisés
 * - 4 blocs : Mois, Clients, Stabilité, Équilibre + footer bienveillant
 */

// Palette douce (si tu veux ajuster)
const COLORS = {
  bg: "#FAFAFA",
  card: "#FFFFFF",
  text: "#333333",
  subtext: "#6B7280", // gris doux
  inputBg: "#F2F2F2",
  accent: "#4F5B66", // gris bleu apaisant
  positive: "#34D399", // vert pastel
  warning: "#FCA5A5", // corail clair
  stroke: "#E5E7EB", // bordure carte
  shadow: "0 6px 24px rgba(0,0,0,0.06)",
};

function currency(n) {
  if (n === "" || n === null || n === undefined || isNaN(Number(n))) return "—";
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
    Number(n)
  );
}

export default function App() {
  // === Données éditables (inputs visibles) ===
  const [goalMonthly, setGoalMonthly] = useState(2500);
  const [currentRevenue, setCurrentRevenue] = useState(1850);
  const [pendingRevenue, setPendingRevenue] = useState(580);
  const [charges, setCharges] = useState(620);

  const [hoursCare, setHoursCare] = useState(25);
  const [hoursTravel, setHoursTravel] = useState(10);
  const [hoursAdmin, setHoursAdmin] = useState(5);

  // Top clients (lecture simple pour ce proto — on pourra les rendre éditables ensuite)
  const clients = [
    { name: "Sophie Martin", amount: 480, reliable: true },
    { name: "Lucas & Max", amount: 380, reliable: true },
    { name: "Famille Durand", amount: 350, reliable: false }, // alerte douce
  ];

  // === Calculs ===
  const progressPct = useMemo(() => {
    if (!goalMonthly) return 0;
    return Math.min(Math.max((Number(currentRevenue) / Number(goalMonthly)) * 100, 0), 100);
  }, [goalMonthly, currentRevenue]);

  const totalForecast = Number(currentRevenue) + Number(pendingRevenue);
  const net = totalForecast - Number(charges);

  const totalHours = Number(hoursCare) + Number(hoursTravel) + Number(hoursAdmin);
  const hourlyRate = totalHours > 0 ? Number(currentRevenue) / totalHours : 0;
  const travelRatio = totalHours > 0 ? Math.round((Number(hoursTravel) / totalHours) * 100) : 0;

  // === Styles inline (évite de dépendre d’un framework CSS) ===
  const page = {
    minHeight: "100vh",
    background: COLORS.bg,
    color: COLORS.text,
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  };

  const container = {
    width: "100%",
    maxWidth: 440, // proche iPhone largeur utile
    padding: "32px 24px",
    margin: "0 auto",
  };

  const headerTitle = {
    fontSize: 22,
    fontWeight: 650,
    margin: 0,
    textAlign: "center",
  };

  const headerSub = {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.subtext,
    textAlign: "center",
  };

  const card = {
    background: COLORS.card,
    border: `1px solid ${COLORS.stroke}`,
    borderRadius: 16,
    boxShadow: COLORS.shadow,
    padding: 16,
  };

  const cardTitle = {
    fontSize: 18,
    fontWeight: 600,
    margin: 0,
    marginBottom: 8,
  };

  const cardSub = {
    fontSize: 13,
    color: COLORS.subtext,
    marginTop: -2,
    marginBottom: 10,
  };

  const row = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "6px 0",
    fontSize: 14,
  };

  const label = { color: COLORS.text };
  const value = { fontWeight: 600 };

  const input = {
    width: 110,
    border: "none",
    borderRadius: 10,
    background: COLORS.inputBg,
    padding: "8px 10px",
    textAlign: "right",
    fontSize: 14,
    outline: "none",
  };

  const bigNumber = { fontSize: 20, fontWeight: 700 };
  const divider = { border: "none", borderTop: `1px solid ${COLORS.stroke}`, margin: "8px 0" };

  const progressWrap = {
    width: "100%",
    height: 8,
    background: "#ECECEC",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 6,
  };
  const progressInner = {
    height: "100%",
    width: `${Math.round(progressPct)}%`,
    background: COLORS.accent,
    borderRadius: 999,
    transition: "width 280ms ease",
  };

  const hint = { fontSize: 13, color: COLORS.subtext, marginTop: 8, lineHeight: 1.35 };

  const footer = {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.subtext,
    paddingTop: 12,
  };

  return (
    <div style={page}>
      <main style={container}>
        {/* Header */}
        <header style={{ marginBottom: 18 }}>
          <h1 style={headerTitle}>Sérénité du mois 🐾</h1>
          <p style={headerSub}>Tu avances bien, voici où tu en es.</p>
        </header>

        {/* 1) Ton mois en un coup d’œil */}
        <section style={{ ...card, marginBottom: 14 }}>
          <h2 style={cardTitle}>🗓️ Ton mois en un coup d’œil</h2>
          <p style={cardSub}>Deux repères clairs : où tu en es, et où tu vas.</p>

          <div style={row}>
            <span style={label}>Revenus encaissés :</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="number"
                inputMode="decimal"
                style={input}
                value={currentRevenue}
                onChange={(e) => setCurrentRevenue(e.target.value)}
                aria-label="Revenus encaissés"
              />
            </div>
          </div>

          <div style={row}>
            <span style={label}>Objectif mensuel :</span>
            <input
              type="number"
              inputMode="decimal"
              style={input}
              value={goalMonthly}
              onChange={(e) => setGoalMonthly(e.target.value)}
              aria-label="Objectif mensuel"
            />
          </div>

          <div style={progressWrap}>
            <div style={progressInner} />
          </div>
          <p style={hint}>
            Tu as déjà atteint <strong>{Math.round(progressPct)}%</strong> de ton
            objectif, bravo 👏
          </p>
        </section>

        {/* 2) Tes clients fiables (léger) */}
        <section style={{ ...card, marginBottom: 14 }}>
          <h2 style={cardTitle}>👥 Tes clients fiables</h2>
          <p style={cardSub}>Repère qui te donne de la tranquillité.</p>

          {clients.map((c, i) => (
            <div key={i} style={row}>
              <span style={label}>
                {c.reliable ? "⭐" : "⚠️"} {c.name}
              </span>
              <span style={value}>{currency(c.amount)}</span>
            </div>
          ))}

          <p style={hint}>
            Ces clients t’apportent l’essentiel de ta sérénité 💚. Garde le lien
            simple avec eux.
          </p>
        </section>

        {/* 3) Stabilité financière (dense mais calculé) */}
        <section style={{ ...card, marginBottom: 14 }}>
          <h2 style={cardTitle}>💰 Stabilité financière</h2>
          <p style={cardSub}>Vision claire de la fin du mois.</p>

          <div style={row}>
            <span style={label}>Reste à encaisser :</span>
            <input
              type="number"
              inputMode="decimal"
              style={input}
              value={pendingRevenue}
              onChange={(e) => setPendingRevenue(e.target.value)}
              aria-label="Reste à encaisser"
            />
          </div>

          <div style={row}>
            <span style={label}>Charges estimées :</span>
            <input
              type="number"
              inputMode="decimal"
              style={input}
              value={charges}
              onChange={(e) => setCharges(e.target.value)}
              aria-label="Charges estimées"
            />
          </div>

          <hr style={divider} />

          <div style={row}>
            <span style={label}>Projection fin de mois :</span>
            <span style={value}>{currency(totalForecast)}</span>
          </div>

          <div style={{ ...row, fontSize: 16 }}>
            <span style={{ ...label, fontWeight: 600 }}>Net estimé :</span>
            <span style={{ ...value, ...bigNumber, color: COLORS.accent }}>{currency(net)}</span>
          </div>

          <p style={hint}>💚 Ton mois est sécurisé 🐶</p>
        </section>

        {/* 4) Équilibre de vie (dense + insight actionnable) */}
        <section style={{ ...card, marginBottom: 10 }}>
          <h2 style={cardTitle}>⚖️ Équilibre de vie</h2>
          <p style={cardSub}>Ton temps est précieux. Visualise-le simplement.</p>

          <div style={row}>
            <span style={label}>Heures de garde :</span>
            <input
              type="number"
              inputMode="decimal"
              style={{ ...input, width: 84 }}
              value={hoursCare}
              onChange={(e) => setHoursCare(e.target.value)}
              aria-label="Heures de garde"
            />
          </div>

          <div style={row}>
            <span style={label}>Heures de trajet :</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="number"
                inputMode="decimal"
                style={{ ...input, width: 84, background: COLORS.inputBg }}
                value={hoursTravel}
                onChange={(e) => setHoursTravel(e.target.value)}
                aria-label="Heures de trajet"
              />
              {travelRatio > 20 && (
                <span style={{ color: COLORS.warning, fontWeight: 600 }}>⚠️</span>
              )}
            </div>
          </div>

          <div style={row}>
            <span style={label}>Heures d’admin :</span>
            <input
              type="number"
              inputMode="decimal"
              style={{ ...input, width: 84 }}
              value={hoursAdmin}
              onChange={(e) => setHoursAdmin(e.target.value)}
              aria-label="Heures d’admin"
            />
          </div>

          <hr style={divider} />

          <div style={row}>
            <span style={{ ...label, color: COLORS.subtext }}>Total cette période :</span>
            <span style={{ ...value, ...bigNumber }}>{totalHours} h</span>
          </div>

          <div style={row}>
            <span style={{ ...label, color: COLORS.subtext }}>Revenu horaire réel :</span>
            <span style={{ ...value, color: COLORS.accent }}>{currency(hourlyRate)}/h</span>
          </div>

          <p style={hint}>
            💡 Tes {hoursTravel}h de trajets = {travelRatio}% de ton temps. Regrouper 2 clients
            du même quartier pourrait te libérer ~2h/semaine.
          </p>
        </section>

        {/* Footer doux */}
        <footer style={footer}>
          💚 Ton calme est ta force. Prends soin de toi aussi 🐾
        </footer>
      </main>
    </div>
  );
}
