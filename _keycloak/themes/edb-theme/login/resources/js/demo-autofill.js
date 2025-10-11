(function () {
  const qs = new URLSearchParams(location.search);
  if (!qs.has('demo')) return; // only on ?demo=1

  // Don’t auto-login if Keycloak shows an error (bad creds, etc.)
  if (
    document.querySelector(
      '#input-error, .alert-error, .pf-c-alert.pf-m-danger',
    )
  )
    return;

  const user = 'demo@demo.com';
  const pass = 'demo123';

  const u = document.getElementById('username');
  const p = document.getElementById('password');
  const form = document.querySelector('form');

  if (u) u.value = user;
  if (p) p.value = pass;

  // Optional: auto-submit. Comment out if you only want prefill.
  setTimeout(() => {
    if (form && u?.value && p?.value) form.submit();
  }, 150);
})();
