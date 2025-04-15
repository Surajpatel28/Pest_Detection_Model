function HowItWorksPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          How PEST.ai Works
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Our AI-powered system makes pest detection simple and provides eco-friendly solutions in just four easy steps.
        </p>
      </div>

      {/* Process Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {/* Step 1 */}
        <div className="relative">
          <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-100 h-full">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg 
                className="w-8 h-8 text-green-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              1. Upload Image
            </h3>
            <p className="text-gray-600">
              Take a clear photo of the affected plant or crop and upload it to our platform. We support common image formats like JPG and PNG.
            </p>
          </div>
          <div className="hidden lg:block absolute -right-8 top-1/2 transform -translate-y-1/2 z-10">
            <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative">
          <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-100 h-full">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg 
                className="w-8 h-8 text-blue-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              2. AI Processing
            </h3>
            <p className="text-gray-600">
              Our advanced AI model processes your image, analyzing it for signs of common crop pests and diseases with high accuracy.
            </p>
          </div>
          <div className="hidden lg:block absolute -right-8 top-1/2 transform -translate-y-1/2 z-10">
            <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative">
          <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-100 h-full">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
              <svg 
                className="w-8 h-8 text-yellow-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              3. Pest Detection
            </h3>
            <p className="text-gray-600">
              The model identifies the specific pest affecting your crops, providing detailed information about the detected pest species.
            </p>
          </div>
          <div className="hidden lg:block absolute -right-8 top-1/2 transform -translate-y-1/2 z-10">
            <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        {/* Step 4 */}
        <div>
          <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-100 h-full">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg 
                className="w-8 h-8 text-green-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              4. Eco-Friendly Solutions
            </h3>
            <p className="text-gray-600">
              Receive environmentally friendly treatment recommendations and prevention strategies tailored to the identified pest.
            </p>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-green-50 rounded-xl p-8 mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Why Choose Our AI-Powered Solution?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Fast & Accurate</h3>
            <p className="text-gray-600">
              Get results in seconds with our highly accurate AI model trained on thousands of pest images.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Eco-Friendly</h3>
            <p className="text-gray-600">
              All our recommended solutions prioritize environmental sustainability and natural treatments.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Easy to Use</h3>
            <p className="text-gray-600">
              Simple upload process and clear results make pest management accessible to everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowItWorksPage;