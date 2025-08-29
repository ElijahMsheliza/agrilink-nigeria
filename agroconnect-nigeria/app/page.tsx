import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo/Title */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-4">
              <span className="text-green-600">Agro</span>
              <span className="text-orange-600">Connect</span>
              <span className="text-gray-700"> Nigeria</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Connecting Nigerian farmers with buyers across the country
            </p>
          </div>

          {/* Description */}
          <div className="mb-12">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Join thousands of farmers and buyers in Nigeria&apos;s premier agricultural marketplace. 
              Trade rice, maize, cassava, yam, plantain, cocoa, and palm oil with confidence.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/signup?type=farmer"
              className="w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              I&apos;m a Farmer
            </Link>
            <Link 
              href="/signup?type=buyer"
              className="w-full sm:w-auto px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors duration-200 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              I&apos;m a Buyer
            </Link>
          </div>

          {/* Features Preview */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-xl">🌾</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Crops</h3>
              <p className="text-gray-600">Premium agricultural products from verified farmers</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 text-xl">🤝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Trading</h3>
              <p className="text-gray-600">Safe and transparent transactions across Nigeria</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-xl">📱</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile First</h3>
              <p className="text-gray-600">Optimized for mobile devices and slow connections</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
