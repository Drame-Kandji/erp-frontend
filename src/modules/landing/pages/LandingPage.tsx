import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  ClipboardCheck,
  Clock3,
  FileText,
  Globe,
  KeyRound,
  Layers,
  MapPin,
  Network,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../shared/stores/auth.store";

const modules = [
  {
    icon: Building2,
    title: "Organisations & multi-sites",
    description:
      "Gérez vos entités, agences, sites et départements dans une arborescence claire et centralisée.",
  },
  {
    icon: Users,
    title: "Ressources humaines",
    description:
      "Dossiers employés, contrats, affectations et documents administratifs réunis au même endroit.",
  },
  {
    icon: ClipboardCheck,
    title: "Présences & pointage",
    description:
      "Suivez les présences, retards et absences avec des états de service fiables et exportables.",
  },
  {
    icon: Clock3,
    title: "Timesheets",
    description:
      "Les collaborateurs saisissent leur temps, les responsables valident et consolident en un clic.",
  },
  {
    icon: KeyRound,
    title: "Rôles & permissions",
    description:
      "Un contrôle d'accès par rôle précis : super administrateur, administrateur, RH ou collaborateur.",
  },
  {
    icon: Activity,
    title: "Journal d'audit",
    description:
      "Chaque action est tracée. Sécurité, conformité et traçabilité pour vos environnements sensibles.",
  },
];

const profiles = [
  {
    tag: "SUPER ADMIN",
    title: "Super administrateur",
    description:
      "Pilote l'ensemble de la plateforme, crée et supprime les organisations et gère tous les comptes.",
  },
  {
    tag: "ADMIN",
    title: "Administrateur",
    description:
      "Administre son organisation : sites, départements, utilisateurs et paramètres de son périmètre.",
  },
  {
    tag: "RH",
    title: "Responsable RH",
    description:
      "Gère les employés, les présences, les contrats et suit l'activité des équipes au quotidien.",
  },
  {
    tag: "COLLAB",
    title: "Collaborateur",
    description:
      "Consulte son espace personnel, saisit ses timesheets et suit son temps de travail.",
  },
];

const stats = [
  { value: "4", label: "profils d'accès" },
  { value: "6+", label: "modules métiers" },
  { value: "100%", label: "actions tracées" },
  { value: "24/7", label: "disponibilité" },
];

export function LandingPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const ctaLabel = isAuthenticated ? "Ouvrir mon espace" : "Se connecter";
  const goToApp = () =>
    navigate(isAuthenticated ? "/dashboard" : "/login");

  return (
    <div className="landing">
      <header className="landing-nav">
        <div className="landing-brand">
          <span className="brand-mark">N</span>
          <span>
            NOLI <b>CORE</b>
          </span>
        </div>
        <nav className="landing-nav-links">
          <a href="#modules">Modules</a>
          <a href="#profils">Profils</a>
          <a href="#solution">La solution</a>
        </nav>
        <button className="primary-button landing-nav-cta" onClick={goToApp}>
          {ctaLabel}
          <ArrowRight size={16} />
        </button>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-glow" aria-hidden="true" />
        <div className="landing-hero-copy">
          <span className="landing-pill">
            <Sparkles size={14} />
            Plateforme ERP sectorielle
          </span>
          <h1>
            Le pilotage humain et opérationnel,
            <span> au même endroit.</span>
          </h1>
          <p>
            NOLI CORE centralise vos organisations, vos équipes, vos présences et
            vos données RH dans une base de travail claire, pensée pour les
            entreprises du BTP, des mines et des carrières.
          </p>
          <div className="landing-hero-actions">
            <button className="primary-button landing-cta-lg" onClick={goToApp}>
              {ctaLabel}
              <ArrowRight size={17} />
            </button>
            <a className="landing-ghost-button" href="#modules">
              Découvrir les modules
            </a>
          </div>
          <ul className="landing-hero-points">
            <li>
              <Check size={15} /> Multi-organisations & multi-sites
            </li>
            <li>
              <Check size={15} /> Accès sécurisé par rôle
            </li>
            <li>
              <Check size={15} /> Traçabilité complète
            </li>
          </ul>
        </div>

        <div className="landing-hero-visual" aria-hidden="true">
          <div className="landing-mock">
            <div className="landing-mock-head">
              <span className="landing-mock-dot" />
              <span>
                <small>Organisation active</small>
                <strong>NOLI CORE · Siège</strong>
              </span>
              <span className="landing-mock-badge">ERP</span>
            </div>
            <div className="landing-mock-kpis">
              <div className="landing-mock-kpi">
                <Users size={15} />
                <small>Employés</small>
                <b>178</b>
              </div>
              <div className="landing-mock-kpi">
                <Building2 size={15} />
                <small>Sites</small>
                <b>12</b>
              </div>
              <div className="landing-mock-kpi">
                <ClipboardCheck size={15} />
                <small>Présents</small>
                <b>152</b>
              </div>
            </div>
            <div className="landing-mock-bars">
              <span style={{ height: "42%" }} />
              <span style={{ height: "63%" }} />
              <span style={{ height: "51%" }} />
              <span style={{ height: "78%" }} />
              <span style={{ height: "66%" }} />
              <span style={{ height: "92%" }} />
              <span style={{ height: "74%" }} />
            </div>
          </div>
        </div>
      </section>

      <section className="landing-stats">
        {stats.map((stat) => (
          <div className="landing-stat" key={stat.label}>
            <b>{stat.value}</b>
            <small>{stat.label}</small>
          </div>
        ))}
      </section>

      <section className="landing-section" id="solution">
        <div className="landing-section-head">
          <span className="eyebrow">LA SOLUTION</span>
          <h2>Une plateforme unique pour tout votre périmètre</h2>
          <p>
            NOLI CORE remplace les tableurs et les outils dispersés par un
            environnement cohérent : chaque module partage les mêmes données,
            les mêmes rôles et la même logique métier.
          </p>
        </div>
        <div className="landing-value-grid">
          <article className="landing-value">
            <Layers size={20} />
            <b>Architecture modulaire</b>
            <p>
              Activez les modules dont vous avez besoin et faites évoluer votre
              couverture fonctionnelle sans rupture.
            </p>
          </article>
          <article className="landing-value">
            <ShieldCheck size={20} />
            <b>Sécurité par rôle</b>
            <p>
              Chaque utilisateur n'accède qu'à ce qui le concerne, du super
              administrateur au collaborateur.
            </p>
          </article>
          <article className="landing-value">
            <BarChart3 size={20} />
            <b>Pilotage en temps réel</b>
            <p>
              Tableaux de bord, indicateurs et états consolidés pour décider
              vite et juste.
            </p>
          </article>
          <article className="landing-value">
            <Globe size={20} />
            <b>Pensé pour le terrain</b>
            <p>
              Multi-sites, multi-départements et contraintes sectorielles du
              BTP, des mines et des carrières.
            </p>
          </article>
        </div>
      </section>

      <section className="landing-section" id="modules">
        <div className="landing-section-head">
          <span className="eyebrow">MODULES</span>
          <h2>Tout ce qu'il faut pour opérer au quotidien</h2>
          <p>
            Des fonctionnalités concrètes, connectées entre elles, qui couvrent
            l'organisation, les ressources humaines et le temps de travail.
          </p>
        </div>
        <div className="landing-module-grid">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <article className="landing-module" key={module.title}>
                <span className="landing-module-icon">
                  <Icon size={19} />
                </span>
                <b>{module.title}</b>
                <p>{module.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="landing-section" id="profils">
        <div className="landing-section-head">
          <span className="eyebrow">PROFILS</span>
          <h2>Chaque utilisateur à sa juste place</h2>
          <p>
            Quatre profils complémentaires structurent les droits d'accès et
            protègent vos données sensibles.
          </p>
        </div>
        <div className="landing-profile-grid">
          {profiles.map((profile) => (
            <article className="landing-profile" key={profile.title}>
              <span className="landing-profile-tag">{profile.tag}</span>
              <b>{profile.title}</b>
              <p>{profile.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-cta-band">
        <div className="landing-cta-inner">
          <span className="landing-pill landing-pill--dark">
            <MapPin size={14} />
            Prêt à démarrer ?
          </span>
          <h2>Reprenez le contrôle de vos opérations</h2>
          <p>
            Connectez-vous dès maintenant et explorez la plateforme avec votre
            profil d'accès.
          </p>
          <button className="primary-button landing-cta-lg" onClick={goToApp}>
            {ctaLabel}
            <ArrowRight size={17} />
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-brand">
          <span className="brand-mark">N</span>
          <span>
            NOLI <b>CORE</b>
          </span>
        </div>
        <p>ERP sectorielle pour le BTP, les mines et les carrières.</p>
        <span className="landing-footer-meta">
          <Network size={14} /> © {new Date().getFullYear()} NOLI CORE —{" "}
          <FileText size={13} /> Tous droits réservés.
        </span>
      </footer>
    </div>
  );
}
