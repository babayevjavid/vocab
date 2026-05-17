import type { Stats } from "../types";
type Props = {
  stats: Stats;
};

export function StatsPanel({ stats }: Props) {
  const winRate =
    stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;
  const maxBar = Math.max(...stats.distribution, 1);

  return (
    <div className="stats-panel">
      <div className="stats-summary">
        <StatBox value={stats.played} label="Played" />
        <StatBox value={winRate} label="Win %" />
        <StatBox value={stats.currentStreak} label="Streak" />
        <StatBox value={stats.maxStreak} label="Best" />
      </div>

      <p className="stats-heading">Guess distribution</p>
      <div className="distribution">
        {stats.distribution.map((count, i) => (
          <div key={i} className="dist-row">
            <span className="dist-label">{i + 1}</span>
            <div className="dist-bar-wrap">
              <div
                className="dist-bar"
                style={{ width: `${Math.max(8, (count / maxBar) * 100)}%` }}
              >
                {count}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="stat-box">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
