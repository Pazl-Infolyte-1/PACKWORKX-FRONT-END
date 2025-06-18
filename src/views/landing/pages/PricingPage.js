import React, { useEffect, useState } from 'react'
import { landingApi } from '../../../api/landingPage'

const PricingPage = ({ showPage,setPackageName }) => {
  const [packages, setPackages] = useState([]);
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'

useEffect(() => {
  const fetchPricing = async () => {
    try {
      const response = await landingApi.displayPricing();
              setPackages(response?.data?.data || []);
      console.log("Pricing Data:", response?.data);
    } catch (error) {
      console.error("Error fetching pricing:", error);
    }
  };

  fetchPricing();
}, []);

  return (
    <div>
      <section className="landing-page-header">
        <div className="landing-container">
          <h1>Choose Your Plan</h1>
          <p>Flexible pricing options designed to grow with your business</p>
        </div>
      </section>

     <section className="landing-container">
      {/* Toggle Button */}
      <div className="flex justify-center mb-6 mt-4">
        <div className="flex gap-4">
          <button
            className={`landing-btn ${billingCycle === 'monthly' ? 'landing-btn-primary' : ''}`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly Billing
          </button>
          <button
            className={`landing-btn ${billingCycle === 'annual' ? 'landing-btn-primary' : ''}`}
            onClick={() => setBillingCycle('annual')}
          >
            Annual Billing
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="landing-pricing-grid">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`landing-pricing-card ${pkg.is_recommended ? 'featured' : ''}`}
          >
            <h3>{pkg.name}</h3>
            <div className="landing-price">
              {pkg.currency?.currency_symbol}
              {billingCycle === 'monthly' ? pkg.monthly_price : pkg.annual_price}
              <span style={{ fontSize: '1rem' }}>
                /{billingCycle === 'monthly' ? 'month' : 'year'}
              </span>
            </div>

            <ul className="landing-features-list">
              {pkg.module_in_package?.slice(0, 8).map((feature, index) => (
                <li key={index}>
                  {feature.charAt(0).toUpperCase() + feature.slice(1).replace(/_/g, ' ')}
                </li>
              ))}
              {pkg.module_in_package.length > 8 && (
                <li>+ {pkg.module_in_package.length - 8} more modules</li>
              )}
            </ul>

            <button
              className="landing-btn landing-btn-primary"
  onClick={() => {
    setPackageName(pkg.name);  // <-- set name like "Starter", "Medium", etc.
    showPage('signup');        // then go to signup page
  }}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </section>
    </div>
  )
}

export default PricingPage
