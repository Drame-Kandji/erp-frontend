import { useEffect } from "react";
import { AppProviders } from "./app/providers/AppProviders";
import { AppRouter } from "./app/router/AppRouter";
import { SplashScreen } from "./shared/components/SplashScreen";
import { useAuthStore } from "./shared/stores/auth.store";

export default function App() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const status = useAuthStore((state) => state.status);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  if (status === "idle" || status === "loading") return <SplashScreen />;

  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
