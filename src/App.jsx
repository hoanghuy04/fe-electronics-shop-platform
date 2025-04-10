import { BrowserRouter } from "react-router-dom";
import AllRoutes from "./components/AllRoutes";
import ScrollToTop from "./utils/ScrollToTop";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <AllRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
