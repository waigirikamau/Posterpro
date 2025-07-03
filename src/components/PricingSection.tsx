import React from 'react';
import { Check, Crown, Zap, Star } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: 'Pay Per Design',
      price: '50',
      period: 'per poster',
      description: 'Perfect for occasional users',
      features: [
        '1 High-quality poster download',
        'PNG & PDF formats',
        'Basic templates access',
        'Standard resolution',
        'Email support'
      ],
      buttonText: 'Create Poster',
      buttonClass: 'bg-gray-900 text-white hover:bg-gray-800',
      popular: false
    },
    {
      name: 'Weekly Unlimited',
      price: '200',
      period: 'per week',
      description: 'Great for active businesses',
      features: [
        'Unlimited poster creation',
        'All template categories',
        'Premium templates',
        'High resolution exports',
        'Priority support',
        'Custom branding',
        'Bulk download'
      ],
      buttonText: 'Start Free Trial',
      buttonClass: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg',
      popular: true
    },
    {
      name: 'Monthly Pro',
      price: '500',
      period: 'per month',
      description: 'Best for growing businesses',
      features: [
        'Everything in Weekly plan',
        'AI text generation',
        'Custom color schemes',
        'Logo upload',
        'Team collaboration',
        'White-label options',
        'API access',
        'Phone support'
      ],
      buttonText: 'Go Pro',
      buttonClass: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-lg',
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 p-2 rounded-full">
              <Crown className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Affordable Pricing for Every Business
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start creating professional posters today. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-purple-600 transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-sm text-gray-500">KES</span>
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500">/{plan.period.split(' ')[1]}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <div className="bg-green-100 p-1 rounded-full mt-0.5">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${plan.buttonClass}`}>
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            💳 Accept M-Pesa, Airtel Money, and all major payment methods
          </p>
          <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <Zap className="h-4 w-4" />
              <span>Instant activation</span>
            </span>
            <span className="flex items-center space-x-1">
              <Check className="h-4 w-4" />
              <span>7-day money back</span>
            </span>
            <span className="flex items-center space-x-1">
              <Crown className="h-4 w-4" />
              <span>Cancel anytime</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;