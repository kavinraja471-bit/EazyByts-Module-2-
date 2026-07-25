import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LineChart, Briefcase, BookOpen, LogOut, LayoutDashboard } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar glass-card">
      <div className="navbar-brand">
        <LineChart color="#3b82f6" size={28} />
        <Link to="/" className="brand-text">StockDash</Link>
      </div>
      {user ? (
        <div className="navbar-links animate-fade-in">
          <Link to="/" className="nav-link"><LayoutDashboard size={18}/> Dashboard</Link>
          <Link to="/portfolio" className="nav-link"><Briefcase size={18}/> Portfolio</Link>
          <Link to="/education" className="nav-link"><BookOpen size={18}/> Education</Link>
          
          <div className="user-info">
            <span className="balance badge badge-success">${user.balance.toFixed(2)}</span>
            <span className="username">{user.username}</span>
            <button onClick={handleLogout} className="btn-icon" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="navbar-links">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="btn btn-primary">Sign Up</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
