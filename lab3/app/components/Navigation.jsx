import { Link } from 'react-router';

export default function Navigation() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">Księgarnia</Link>
        <div className="navbar-nav">
          <Link className="nav-link" to="/new">Nowa książka</Link>
          <Link className="nav-link" to="/login">Login</Link>
        </div>
      </div>
    </nav>
  );
}
