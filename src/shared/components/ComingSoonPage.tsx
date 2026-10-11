import type { LucideIcon } from "lucide-react";
import { Construction } from "lucide-react";

export type ComingSoonFeature = {
  title: string;
  description: string;
};

export function ComingSoonPage({
  label,
  title,
  description,
  icon: Icon = Construction,
  features = [],
}: {
  label: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  features?: ComingSoonFeature[];
}) {
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">{label}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <span className="coming-soon-badge">
          <Construction size={14} /> En cours de développement
        </span>
      </div>
      <section className="panel coming-soon-panel">
        <div className="coming-soon-hero">
          <div className="mock-illustration">
            <Icon size={26} />
          </div>
          <h2>Bientôt disponible</h2>
          <p>
            Cette section fait partie de la feuille de route de NOLI CORE. Elle
            sera activée dans une prochaine version.
          </p>
        </div>
        {features.length > 0 && (
          <div className="coming-soon-features">
            {features.map((feature) => (
              <div className="coming-soon-feature" key={feature.title}>
                <span className="coming-soon-dot" />
                <div className="coming-soon-feature-copy">
                  <b>{feature.title}</b>
                  <small>{feature.description}</small>
                </div>
                <span className="coming-soon-tag">À venir</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
