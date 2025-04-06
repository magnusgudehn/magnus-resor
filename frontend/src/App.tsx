import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TripDetails from './pages/TripDetails';
import { seedTestData } from './utils/seedData';

function App() {
  useEffect(() => {
    // Kör bara seedData om localStorage är tom
    if (!localStorage.getItem('travel_trips')) {
      seedTestData();
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trip/:tripId" element={<TripDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 
