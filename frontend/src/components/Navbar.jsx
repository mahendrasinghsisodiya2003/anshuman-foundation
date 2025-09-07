import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center p-4 border-b mb-4">
      <Link to="/" className="font-bold text-xl">Resume Platform</Link>
      <div className="flex gap-4">
        <Link to="/" className="btn">Dashboard</Link>
        <Link to="/login" className="btn">Login</Link>
        <Link to="/signup" className="btn">Signup</Link>
      </div>
    </nav>
  );
}
