import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-4">
            <img src="/pest-logo.png" alt="PEST.ai" className="h-14 w-14 md:h-16 md:w-16" />
            <div className="flex flex-col">
              <span className="text-3xl md:text-4xl font-bold text-green-800 leading-none">PEST.ai</span>
              <span className="text-sm text-green-600 font-medium">Smart Pest Detection</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                isActiveRoute('/') 
                  ? 'text-green-700 bg-green-50' 
                  : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/detection" 
              className={`px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                isActiveRoute('/detection') 
                  ? 'text-green-700 bg-green-50' 
                  : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
              }`}
            >
              Detection
            </Link>
            <Link 
              to="/how-it-works" 
              className={`px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                isActiveRoute('/how-it-works') 
                  ? 'text-green-700 bg-green-50' 
                  : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
              }`}
            >
              How it Works
            </Link>
            <a 
              href="https://github.com/yourusername/pest-ai" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="ml-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-base font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2 border border-gray-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span>GitHub</span>
            </a>
          </div>
          
          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu (hidden by default) */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link 
            to="/" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActiveRoute('/') 
                ? 'text-green-700 bg-green-50' 
                : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/detection" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActiveRoute('/detection') 
                ? 'text-green-700 bg-green-50' 
                : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
            }`}
          >
            Detection
          </Link>
          <Link 
            to="/how-it-works" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActiveRoute('/how-it-works') 
                ? 'text-green-700 bg-green-50' 
                : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
            }`}
          >
            How it Works
          </Link>
          <a 
            href="https://github.com/yourusername/pest-ai" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-md"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 