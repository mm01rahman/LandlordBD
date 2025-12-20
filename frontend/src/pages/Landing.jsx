import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100">
      {/* Navbar */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <h1 className="text-xl font-bold tracking-wide">
          Landlord<span className="text-primary-500">BD</span>
        </h1>

        <div className="space-x-4">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:text-white"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto mt-20 max-w-7xl px-6 text-center">
        <h2 className="text-4xl font-bold leading-tight md:text-5xl">
          Smart Rental Home <br />
          <span className="text-primary-500">Management Made Simple</span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-slate-400">
          Manage buildings, tenants, rent payments, and outstanding dues —
          all from one intelligent dashboard built for modern landlords.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            to="/signup"
            className="rounded-xl bg-primary-500 px-6 py-3 font-medium text-white hover:bg-primary-600"
          >
            Start Free
          </Link>

          <Link
            to="/login"
            className="rounded-xl border border-white/10 px-6 py-3 text-slate-200 hover:bg-white/5"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto mt-32 max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: 'Centralized Management',
              desc: 'Handle buildings, units, and tenants from a single dashboard.',
            },
            {
              title: 'Smart Payments',
              desc: 'Track rent payments, pending dues, and transaction history.',
            },
            {
              title: 'Secure & Reliable',
              desc: 'Protected routes, secure authentication, and clean architecture.',
            },
          ].map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-32 border-t border-white/10 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} LandlordBD — Smart Rental Platform
      </footer>
    </div>
  );
};

export default Landing;
