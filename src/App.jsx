import { BrowserRouter } from "react-router-dom";
import { AdminProvider } from "./pages/admin/context/AdminContext";
import { SearchProvider } from "./pages/admin/context/SearchContext";
import AllRoutes from './components/AllRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <SearchProvider>
          <AllRoutes />
        </SearchProvider>
      </AdminProvider>
    </BrowserRouter>
  );
}