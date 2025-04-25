// admin/src/utils/api.js
const API    = process.env.REACT_APP_API_BASE_URL;  // e.g. http://localhost:3000
const TENANT = process.env.REACT_APP_TENANT_ID;    // from admin/.env

// ——— Weekly‐report config —————————————————————————————————
export async function saveConfig(config) {
  const resp = await fetch(`${API}/api/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tenantId: TENANT, ...config })
  });
  if (!resp.ok) throw new Error(`Save failed (${resp.status})`);
  return resp.json();
}

// ——— Billing —————————————————————————————————————————
export async function createCheckoutSession() {
  const resp = await fetch(
    `${API}/api/stripe/checkout?tenantId=${TENANT}`
  );
  if (!resp.ok) throw new Error(`Checkout failed (${resp.status})`);
  const { url } = await resp.json();
  return url;
}

export async function fetchBillingStatus() {
  const resp = await fetch(
    `${API}/api/config?tenantId=${TENANT}`
  );
  if (!resp.ok) throw new Error(`Fetch billing failed (${resp.status})`);
  return resp.json();
}

// ——— User Management ———————————————————————————————————
export async function fetchUsers() {
  const resp = await fetch(
    `${API}/api/users?tenantId=${TENANT}`
  );
  if (!resp.ok) throw new Error(`Fetch users failed (${resp.status})`);
  return resp.json();
}

export async function addUser(user) {
  const resp = await fetch(`${API}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tenantId: TENANT, user })
  });
  if (!resp.ok) throw new Error(`Add user failed (${resp.status})`);
  return resp.json();
}

export async function updateUserRoles(aadId, roles) {
  console.log('📡  updateUserRoles payload:', {
        tenantId: TENANT,
        aadId,
        roles
      });
  const resp = await fetch(`${API}/api/users/roles`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tenantId: TENANT, aadId, roles })
  });
  if (!resp.ok) throw new Error(`Update roles failed (${resp.status})`);
  return resp.json(); // returns updated users[]
}
