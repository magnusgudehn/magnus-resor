import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TripDetails from "./pages/TripDetails";
import NotFound from "./pages/NotFound";
import Home from './pages/Home';
import NewTrip from './pages/NewTrip';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trips/new" element={<NewTrip />} />
        <Route path="/trips/:id" element={<TripDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
