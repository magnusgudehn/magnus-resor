import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TripDetails from "./pages/TripDetails";
import NotFound from "./pages/NotFound";
import Home from './pages/Home';
import NewTrip from './pages/NewTrip';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-trip" element={<NewTrip />} />
        <Route path="/trips/:id" element={<TripDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </QueryClientProvider>
);

export default App;
