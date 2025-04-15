import { useState } from 'react';

function DetectionPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (!file) return;

    // Reset states
    setError(null);
    setResult(null);

    // Validate file type
    if (!file.type.match('image/(jpeg|jpg|png)')) {
      setError('Please upload a valid image file (JPG, JPEG, or PNG)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // TODO: Implement actual API call here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
      
      // Simulated result
      setResult({
        pest: "Aphids",
        confidence: 95.8,
        treatment: [
          "Use neem oil spray",
          "Introduce natural predators like ladybugs",
          "Apply insecticidal soap"
        ]
      });
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAll = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Detect Pests on Crops Using AI
        </h1>
        <p className="text-xl text-gray-600">
          Upload an image of your affected plant, and let our AI identify the pest and suggest eco-friendly solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex flex-col items-center mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <svg 
                  className="w-6 h-6 text-green-600" 
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
                <span className="text-xl font-medium text-gray-800">Upload Image</span>
              </div>
              <p className="text-sm text-gray-500">
                Supported formats: JPG, PNG, JPEG (max 5MB)
              </p>
            </div>

            <div 
              className={`border-2 border-dashed rounded-lg p-8 transition-colors duration-200 ${
                isDragging 
                  ? 'border-green-500 bg-green-50' 
                  : error 
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 hover:border-green-500'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                {previewUrl ? (
                  <div className="relative w-full aspect-video mb-4">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="rounded-lg object-cover w-full h-full"
                    />
                    <button
                      onClick={resetAll}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <svg 
                        className="w-10 h-10 text-green-600" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600 mb-2 text-center">
                      Drag and drop an image here, or click to browse
                    </p>
                  </>
                )}
                
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png"
                  onChange={handleFileSelect}
                  id="file-upload"
                />
                {!previewUrl && (
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-green-600 hover:text-green-700 font-medium"
                  >
                    Browse Files
                  </label>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={!selectedImage || isAnalyzing}
              className={`w-full mt-6 py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                !selectedImage || isAnalyzing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing Image...
                </div>
              ) : (
                'Analyze Image'
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className={`space-y-6 ${!result && 'lg:mt-12'}`}>
          {result ? (
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h2 className="text-2xl font-semibold text-gray-800">Detection Results</h2>
                </div>
                <div className="flex items-center space-x-2 mb-6">
                  <span className="text-lg font-medium text-gray-600">Detected Pest:</span>
                  <span className="text-lg text-gray-900">{result.pest}</span>
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {result.confidence.toFixed(1)}% confidence
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommended Treatment</h3>
                <ul className="space-y-3">
                  {result.treatment.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={resetAll}
                className="mt-8 w-full py-3 px-4 border-2 border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                Analyze Another Image
              </button>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-100 rounded-xl p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">How It Works</h2>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-medium">1</span>
                  </div>
                  <span className="text-gray-600">Upload a clear photo of the affected plant area</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-medium">2</span>
                  </div>
                  <span className="text-gray-600">Our AI model analyzes the image to identify pests</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-medium">3</span>
                  </div>
                  <span className="text-gray-600">Get instant results with eco-friendly treatment suggestions</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetectionPage; 