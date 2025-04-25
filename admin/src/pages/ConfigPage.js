import React, { useState, useEffect } from 'react';
import { saveConfig, fetchBillingStatus } from '../utils/api';
import Layout from '../components/Layout';

export default function ConfigPage() {
  const [projectKey, setProjectKey] = useState('');
  const [managerAadId, setManagerAadId] = useState('');
  const [cron, setCron] = useState('0 8 * * 1');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // load existing config if any
    (async () => {
      const data = await fetchBillingStatus('<TENANT_ID>');
      if (data.weeklyReportConfig) {
        const cfg = data.weeklyReportConfig;
        setProjectKey(cfg.projectKey);
        setManagerAadId(cfg.managerAadId);
        setCron(cfg.cron);
      }
    })();
  }, []);

  const onSave = async () => {
    try {
      await saveConfig('<TENANT_ID>', { weeklyReportConfig: { projectKey, managerAadId, cron }});
      setStatus('Saved!');
    } catch (e) {
      setStatus('Save failed');
    }
  };

  return (
    <Layout>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-indigo-900">Weekly Report Setup</h2>
    
            <div>
              <label className="block font-medium mb-1">Project Key</label>
              <input
                value={projectKey}
                onChange={e => setProjectKey(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
    
            <div>
              <label className="block font-medium mb-1">Manager AAD ID</label>
              <input
                value={managerAadId}
                onChange={e => setManagerAadId(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
    
            <div>
              <label className="block font-medium mb-1">Schedule (cron)</label>
              <input
                value={cron}
                onChange={e => setCron(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
                <button
              onClick={onSave}
              className="bg-amber-400 hover:bg-amber-300 text-indigo-900 font-semibold px-6 py-3 rounded-lg shadow"
            >
              Save Configuration
            </button>
                {status && <p className="text-sm mt-2">{status}</p>}
          </div>
        </Layout>
  );
}
