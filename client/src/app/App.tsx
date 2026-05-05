import { useEffect } from "react";
import AppRouter from "./router";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useUserStore } from "@/stores/userStore";

const App = () => {
  const { checkToken } = useUserStore();

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  return (
    <>
      <Header />
      <main className="pt-24 md:pt-20">
        <AppRouter />
      </main>
      <Footer />
    </>
  );
};

export default App;
