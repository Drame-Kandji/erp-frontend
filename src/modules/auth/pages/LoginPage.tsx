import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, LogIn, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { demoAccounts } from "../../../shared/constants/demo-accounts";
import { useAuthStore } from "../../../shared/stores/auth.store";

export function LoginPage() {
  const navigate = useNavigate();
  const signIn = useAuthStore((state) => state.signIn);
  const [email, setEmail] = useState("admin@nolicore.local");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const account = demoAccounts.find(
      (item) => item.email === email && item.password === password,
    );
    if (!account) {
      setError("Identifiants de démonstration invalides.");
      return;
    }
    signIn(account);
    navigate("/dashboard", { replace: true });
  };
  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="auth-brand">
          <span className="brand-mark">N</span>
          <span>
            NOLI <b>CORE</b>
          </span>
        </div>
        <div className="auth-visual-copy">
          <span className="eyebrow">PLATEFORME ERP SECTORIELLE</span>
          <h1>Le pilotage humain et opérationnel, au même endroit.</h1>
          <p>
            Une base de travail claire pour les entreprises du BTP, des mines et
            des carrières.
          </p>
        </div>
        <div className="auth-visual-footer">
          <ShieldCheck size={17} /> Accès sécurisé par rôle
        </div>
      </section>
      <section className="auth-form-side">
        <form className="auth-form" onSubmit={submit}>
          <span className="eyebrow">ESPACE DE TRAVAIL</span>
          <h2>Bienvenue dans NOLI CORE</h2>
          <p className="auth-intro">
            Connectez-vous pour accéder à votre environnement.
          </p>
          <label>
            Adresse email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </label>
          <label>
            Mot de passe
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="primary-button auth-submit" type="submit">
            <LogIn size={17} />
            Se connecter
          </button>
          <div className="demo-hint">
            <LockKeyhole size={15} />
            <span>
              <b>Comptes de démonstration</b>
              <small>
                ADMIN, RH et EMPLOYEE sont disponibles sans base de données.
              </small>
            </span>
          </div>
        </form>
      </section>
    </main>
  );
}
