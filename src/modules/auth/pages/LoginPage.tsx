import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, LogIn, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../../../lib/api/client";
import { demoAccounts } from "../../../shared/constants/demo-accounts";
import { useAuthStore } from "../../../shared/stores/auth.store";
import { authService } from "../services/auth.service";

export function LoginPage() {
  const navigate = useNavigate();
  const signIn = useAuthStore((state) => state.signIn);
  const [email, setEmail] = useState("admin@nolicore.local");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);
    try {
      const result = await authService.login({ email: email.trim(), password });
      await signIn(result);
      navigate("/dashboard", { replace: true });
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
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
          <Link to="/" className="auth-back">
            ← Retour à l'accueil
          </Link>
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
              required
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
                required
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
          <button
            className="primary-button auth-submit"
            type="submit"
            disabled={submitting}
          >
            <LogIn size={17} />
            {submitting ? "Connexion en cours…" : "Se connecter"}
          </button>
          <div className="demo-hint">
            <LockKeyhole size={15} />
            <span>
              <b>Comptes de démonstration</b>
              <small>
                Cliquez sur un compte pour remplir le formulaire.
              </small>
              <span className="demo-accounts">
                {demoAccounts.map((account) => (
                  <button
                    type="button"
                    key={account.email}
                    className="demo-account"
                    onClick={() => {
                      setEmail(account.email);
                      setPassword(account.password);
                      setError("");
                    }}
                  >
                    <strong>{account.email}</strong>
                    <em>
                      {account.password} · {account.roleLabel}
                    </em>
                  </button>
                ))}
              </span>
            </span>
          </div>
        </form>
      </section>
    </main>
  );
}
