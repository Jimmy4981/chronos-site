import React, { useState, useEffect } from 'react';
import { createCheckoutSession, fetchBillingStatus } from '../utils/api';
import Layout from '../components/Layout';

export default function BillingPage() {
  const [plan, setPlan]       = useState('');    // start empty
  const [trialEnds, setTrial] = useState(null);

  useEffect(() => {
    fetchBillingStatus()
      .then(data => {
        if (data.billing?.plan) {
          setPlan(data.billing.plan);
          setTrial(new Date(data.billing.trialEnds).toLocaleDateString());
        } else {
          setPlan('starter');
        }
      })
      .catch(err => {
        console.error('Failed to load billing status', err);
        setPlan('starter');
      });
  }, []);

  const onUpgrade = async () => {
    try {
      const url = await createCheckoutSession();
      window.location.href = url;
    } catch (err) {
      console.error('Failed to start checkout', err);
      alert('Could not begin upgrade; check console.');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-indigo-900">Billing</h2>

        <p className="text-lg">
          Plan: <strong>{plan ? plan.toUpperCase() : 'Loading…'}</strong>
        </p>

        {plan === 'starter' && trialEnds && (
          <p className="text-sm text-gray-600">Trial ends: {trialEnds}</p>
        )}

        {plan === 'starter' && (
          <button
            onClick={onUpgrade}
            className="mt-4 bg-amber-400 hover:bg-amber-300 text-indigo-900 font-semibold px-6 py-3 rounded-lg shadow"
          >
            Upgrade to Pro
          </button>
        )}
      </div>
    </Layout>
  );
}
