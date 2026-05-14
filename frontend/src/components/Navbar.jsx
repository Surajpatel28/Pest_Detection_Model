import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <Link to="/" className="flex items-center space-x-4">
            <img src="/pest-logo.png" alt="PEST.ai" className="h-12 w-12" />
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-extrabold text-primary font-manrope leading-none">PEST.ai</span>
              <span className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase mt-1">Smart Detection</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center space-x-2">
            <Link 
              to="/" 
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                isActiveRoute('/') 
                  ? 'text-primary bg-primary/5' 
                  : 'text-gray-600 hover:text-primary hover:bg-primary/5'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/detection" 
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                isActiveRoute('/detection') 
                  ? 'text-primary bg-primary/5' 
                  : 'text-gray-600 hover:text-primary hover:bg-primary/5'
              }`}
            >
              Detection
            </Link>
            <Link 
              to="/how-it-works" 
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                isActiveRoute('/how-it-works') 
                  ? 'text-primary bg-primary/5' 
                  : 'text-gray-600 hover:text-primary hover:bg-primary/5'
              }`}
            >
              How it Works
            </Link>
            <a 
              href="https://github.com/yourusername/pest-ai" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="ml-4 px-5 py-2.5 bg-gray-50 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all flex items-center space-x-2 border border-gray-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span>GitHub</span>
            </a>
          </div>
          
          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-xl hover:bg-surface-container text-on-surface-variant">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu (hidden by default) */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-tertiary/5">
          <Link 
            to="/" 
            className={`block px-4 py-3 rounded-xl text-base font-bold ${
              isActiveRoute('/') 
                ? 'text-primary bg-primary/5' 
                : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/detection" 
            className={`block px-4 py-3 rounded-xl text-base font-bold ${
              isActiveRoute('/detection') 
                ? 'text-primary bg-primary/5' 
                : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
            }`}
          >
            Detection
          </Link>
          <Link 
            to="/how-it-works" 
            className={`block px-4 py-3 rounded-xl text-base font-bold ${
              isActiveRoute('/how-it-works') 
                ? 'text-primary bg-primary/5' 
                : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
            }`}
          >
            How it Works
          </Link>
          <a 
            href="https://github.com/yourusername/pest-ai" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block px-4 py-3 text-base font-bold text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-xl"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 