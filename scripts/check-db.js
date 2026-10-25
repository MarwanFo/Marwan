const key = 'sb_publishable_vu_Gu4XfmNKYLnD6Y-nbog_ibSQv1S9';
const url = 'https://qnszmczdofeahyxitgtn.supabase.co';

async function check() {
  const tables = ['projects', 'experiences', 'skills', 'certificates', 'profile', 'site_settings', 'messages'];
  for (const t of tables) {
    try {
      const res = await fetch(`${url}/rest/v1/${t}?select=*`, {
        headers: { apikey: key }
      });
      const data = await res.json();
      console.log(`${t}:`, Array.isArray(data) ? `${data.length} rows found` : data);
    } catch (e) {
      console.log(`${t}:`, e.message);
    }
  }
}
check();
