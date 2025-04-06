import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-900">
            Travel Organizer
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="secondary">My Trips</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 