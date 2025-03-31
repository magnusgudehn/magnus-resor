
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CreateTripForm from './CreateTripForm';

const Navbar: React.FC = () => {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-travel-primary text-2xl font-bold">TravelOrganizer</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link to="/">My Trips</Link>
          </Button>
          <CreateTripForm />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
