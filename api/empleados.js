module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const BASEROW_API = 'https://api.baserow.io/api';
    const AUTH_TOKEN = 'vZlkbz5gL9rL8J0eeuOZVDedcQ9oik3M';
    const TABLE_ID = '750037';

    const url = `${BASEROW_API}/database/rows/table/${TABLE_ID}/?user_field_names=true&size=100`;
    const response = await fetch(url, {
      headers: { 'Authorization': `Token ${AUTH_TOKEN}` }
    });
    
    const data = await response.json();
    const empleados = (data.results || []).filter(e => 
      (e['Estado'] || '').toLowerCase().includes('nómina') ||
      (e['Estado'] || '').toLowerCase().includes('activo')
    );
    
    res.status(200).json({ success: true, empleados });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
