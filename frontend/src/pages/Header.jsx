import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, User } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // check user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo / Title */}
        <h1 className="text-2xl font-bold text-gray-800">Resume Builder</h1>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <Link
            to="/resumes/new"
            className="flex items-center gap-2 bg-pink-600 text-white px-3 py-2 rounded-lg shadow hover:bg-pink-700 transition"
          >
            <PlusCircle size={20} /> Create New
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-full border hover:bg-gray-100 transition"
              >
                <User size={22} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg py-2 z-50">
                  <p className="px-4 py-2 text-gray-700 font-medium border-b">
                    {user.name}
                  </p>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
