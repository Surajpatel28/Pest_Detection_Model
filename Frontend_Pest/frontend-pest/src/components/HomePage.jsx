import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-20">
        <div className="max-w-xl lg:max-w-2xl">
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full mb-6">
              <span className="text-sm font-semibold text-green-800">
                🌿 AI-Powered Pest Detection
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Protect Your Crops with
              <span className="text-green-600"> Smart Detection</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Upload a photo of your affected plant and get instant AI-powered pest identification 
              with eco-friendly treatment recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/detection"
                className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-lg font-medium group"
              >
                Start Detection
                <svg 
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors duration-200 text-lg font-medium"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 relative">
          <div className="absolute -inset-4 bg-green-100 rounded-lg transform rotate-3"></div>
          <img
            src="/pest-detection.webp"
            alt="Pest Detection Demo"
            className="relative w-full h-auto rounded-lg shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-300"
          />
          {/* Feature Tags */}
          <div className="absolute -right-4 top-1/4 bg-white px-4 py-2 rounded-lg shadow-lg transform rotate-3">
            <p className="text-sm font-medium text-gray-800">🎯 Instant Results</p>
          </div>
          <div className="absolute -left-4 bottom-1/4 bg-white px-4 py-2 rounded-lg shadow-lg transform -rotate-6">
            <p className="text-sm font-medium text-gray-800">🌱 Eco-Friendly Solutions</p>
          </div>
        </div>
      </div>

      {/* Why PEST.ai Section */}
      <div className="mt-20 relative">
        <div className="absolute inset-0 bg-green-50 transform skew-y-3 z-0"></div>
        <div className="relative z-10 py-16">
          <div className="text-center mb-16">
            <span className="text-green-600 font-semibold text-sm tracking-wider uppercase mb-2 block">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Why Choose PEST.ai?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our smart platform combines AI technology with practical solutions to protect your crops effectively.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            {/* Fast Detection */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Fast Detection</h3>
              <p className="text-gray-600 leading-relaxed">
                Get instant pest identification results. Our system processes your images in real-time, providing quick and reliable analysis.
              </p>
            </div>

            {/* AI Powered */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Smart AI Technology</h3>
              <p className="text-gray-600 leading-relaxed">
                Powered by advanced machine learning models trained on diverse crop and pest datasets for accurate identification.
              </p>
            </div>

            {/* Treatment Ready */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Eco-Friendly Solutions</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive environmentally conscious treatment recommendations that protect both your crops and the ecosystem.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-24 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl overflow-hidden">
        <div className="px-8 py-16 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white max-w-xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Protect Your Crops?</h2>
            <p className="text-green-50 text-lg mb-0">
              Start using our AI-powered pest detection system today and safeguard your harvest.
            </p>
          </div>
          <Link
            to="/detection"
            className="inline-flex items-center px-8 py-4 bg-white text-green-700 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors duration-200 shadow-md"
          >
            Try Detection Now
            <svg 
              className="w-5 h-5 ml-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 pt-16 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 max-w-6xl mx-auto">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src="/pest-logo.png" alt="PEST.ai" className="h-8 w-8" />
              <span className="text-xl font-bold text-gray-800">PEST.ai</span>
            </div>
            <p className="text-gray-600 mb-4">
              AI-powered crop pest detection – built for innovation and sustainability.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">Quick Links</h4>
            <div className="space-y-3">
              <Link to="/" className="block text-gray-600 hover:text-green-600">Home</Link>
              <Link to="/detection" className="block text-gray-600 hover:text-green-600">Detection</Link>
              <Link to="/how-it-works" className="block text-gray-600 hover:text-green-600">How it Works</Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">Contact</h4>
            <div className="space-y-3">
              <p className="text-gray-600">
                <span className="font-medium">Email:</span><br />
                shivamgehot128@gmail.com
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">About</h4>
            <p className="text-gray-600 mb-4">
              Built by Team Code Crusaders for Kriyeta 5.0
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 py-8">
          <div className="text-center text-gray-600">
            <p>© 2025 PEST.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage; 