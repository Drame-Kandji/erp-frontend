import { ClipboardList } from "lucide-react";

export function ModulePlaceholderPage({
  title,
  label,
}: {
  title: string;
  label: string;
}) {
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">{label}</span>
          <h1>{title}</h1>
          <p>Un espace métier prêt à accueillir le prochain service Django.</p>
        </div>
      </div>
      <section className="mock-screen">
        <div className="mock-illustration">
          <ClipboardList size={26} />
        </div>
        <span className="eyebrow">SERVICES MOCKÉS</span>
        <h2>Interface disponible en mode démonstration</h2>
        <p>
          Cette fonctionnalité utilise une interface de service indépendante.
          Les données mockées pourront être remplacées par l'API réelle sans
          modifier la page.
        </p>
        <span className="mock-badge">Sans base de données</span>
      </section>
    </>
  );
}
