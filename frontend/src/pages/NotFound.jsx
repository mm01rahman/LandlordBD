import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
    <h1 className="text-4xl font-bold mb-2">404</h1>
    <p className="text-gray-600 mb-4">Page not found</p>
    <Link className="px-4 py-2 bg-indigo-600 text-white rounded" to="/dashboard">
      Back to Dashboard
    </Link>
  </div>
);

export default NotFound;
