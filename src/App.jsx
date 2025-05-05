import { BrowserRouter } from "react-router-dom";
import AllRoutes from "./components/AllRoutes";
import ScrollToTop from "./utils/ScrollToTop";
import { Toaster } from "sonner";

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
