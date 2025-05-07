import AllRoutes from "./components/AllRoutes";
import { Toaster } from "sonner";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
      <Toaster
        richColors={true}
        toastOptions={{
          style: {
            padding: "22px",
            fontSize: "16px",
          },
        }}
      />
      <ScrollToTop />
      <AllRoutes />
    </>
  );
}

export default App;
