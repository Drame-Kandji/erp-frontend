import type { ReactNode } from "react";
import { Activity, ArrowUpRight, Search } from "lucide-react";

export function DataTable({
  headers,
  rows,
  loading,
  error,
  empty,
  rowActions,
}: {
  headers: string[];
  rows: ReactNode[][];
  loading: boolean;
  error: boolean;
  empty: string;
  rowActions?: (index: number) => ReactNode;
}) {
  if (error)
    return (
      <div className="state-box">
        <span className="state-icon">
          <Activity size={19} />
        </span>
        <b>Service indisponible</b>
        <p>Impossible de charger les données demandées.</p>
      </div>
    );
  if (loading)
    return (
      <div className="state-box">
        <div className="spinner" />
        <p>Chargement des données…</p>
      </div>
    );
  if (!rows.length)
    return (
      <div className="state-box">
        <span className="state-icon">
          <Search size={19} />
        </span>
        <b>{empty}</b>
        <p>Les nouvelles données apparaîtront ici.</p>
      </div>
    );
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
              <td>
                {rowActions ? (
                  rowActions(index)
                ) : (
                  <button className="row-action" aria-label="Ouvrir">
                    <ArrowUpRight size={16} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
