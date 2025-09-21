import React, { useState } from "react";
import { ArrowRight, Smartphone, Share2, ShoppingBag, Star, Download, Play } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { mockData } from "../mock";

const LandingPage = () => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            TryOnAI
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-purple-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-purple-600 transition-colors">How it Works</a>
            <a href="#download" className="text-gray-600 hover:text-purple-600 transition-colors">Download</a>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white" onClick={() => window.location.href = '/tryon'}>
            Try It Now
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${mockData.heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Try On
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent block">
                    Fashion
                  </span>
                  Before You Buy
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Experience the future of online shopping with AI-powered virtual try-on technology. 
                  See how clothes look on you instantly, share your looks, and shop with confidence.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
                  onClick={() => window.location.href = '/tryon'}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Try It Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">500K+</div>
                  <div className="text-gray-600">Downloads</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">4.8★</div>
                  <div className="text-gray-600">App Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">1M+</div>
                  <div className="text-gray-600">Try-Ons</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-300">
                <img 
                  src={mockData.heroMockup} 
                  alt="TryOnAI App Mockup" 
                  className="w-full max-w-md mx-auto drop-shadow-2xl"
                />
              </div>
              <div className="absolute top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your perfect look in just three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {mockData.howItWorks.map((step, index) => (
              <div 
                key={index}
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 ${
                  activeStep === step.id ? 'ring-2 ring-purple-500 scale-105' : ''
                }`}
                onMouseEnter={() => setActiveStep(step.id)}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for the perfect virtual shopping experience
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {mockData.features.map((feature, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50">
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">See It In Action</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Take a closer look at our intuitive interface and powerful features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockData.appScreenshots.map((screenshot, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <img 
                  src={screenshot.image} 
                  alt={screenshot.title}
                  className="w-full h-80 object-cover rounded-xl mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{screenshot.title}</h3>
                <p className="text-gray-600">{screenshot.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">What Users Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of happy users who love our virtual try-on experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockData.testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-purple-50">
                <div className="space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic leading-relaxed">"{testimonial.text}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-white">Ready to Transform Your Shopping?</h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Download TryOnAI now and experience the future of fashion. Available on iOS and Android.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
                onClick={() => window.location.href = '/tryon'}
              >
                <Download className="mr-2 h-5 w-5" />
                Try It Now
              </Button>
              <Button 
                size="lg" 
                className="bg-white hover:bg-gray-100 text-purple-600 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
              >
                <Play className="mr-2 h-5 w-5" />
                Google Play
              </Button>
            </div>

            <div className="pt-8">
              <p className="text-purple-200 text-sm">Join over 500,000 users already using TryOnAI</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                TryOnAI
              </div>
              <p className="text-gray-400">
                The future of virtual fashion try-on technology.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TryOnAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;