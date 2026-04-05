export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const BASEROW_API = 'https://api.baserow.io/api';
    const AUTH_TOKEN = 'vZlkbz5gL9rL8J0eeuOZVDedcQ9oik3M';
    const EMPLEADOS_TABLE = '750037';

    let allEmpleados = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore && page <= 10) {
      const url = `${BASEROW_API}/database/rows/table/${EMPLEADOS_TABLE}/?user_field_names=true&size=200&page=${page}`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Token ${AUTH_TOKEN}` }
      });
      
      if (!response.ok) {
        throw new Error(`Baserow error: ${response.status}`);
      }
      
      const data = await response.json();
      const results = data.results || [];
      
      allEmpleados = [...allEmpleados, ...results];
      
      if (!data.next || results.length === 0) {
        hasMore = false;
      } else {
        page++;
      }
    }
    
    const empleados = allEmpleados.filter(e => {
      const estado = (e['Estado'] || '').toLowerCase();
      const estadoLaboral = (e['Estado actual laboral'] || '').toLowerCase();
      return estado.includes('nómina') || estado.includes('activo') || estadoLaboral.includes('nómina');
    });
    
    return res.status(200).json({ success: true, empleados });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
