const BASEROW_API = 'https://api.baserow.io/api';
const AUTH_TOKEN = 'vZlkbz5gL9rL8J0eeuOZVDedcQ9oik3M';

const HORARIOS_TABLE = '749797';

export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let allHorarios = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
      const response = await fetch(`${BASEROW_API}/database/rows/table/${HORARIOS_TABLE}/?user_field_names=true&size=200&page=${page}`, {
        headers: { 'Authorization': `Token ${AUTH_TOKEN}` }
      });
      const data = await response.json();
      
      allHorarios = [...allHorarios, ...(data.results || [])];
      
      if (!data.next || (data.results || []).length === 0) {
        hasMore = false;
      } else {
        page++;
      }
    }
    
    return res.status(200).json({ success: true, horarios: allHorarios });
  } catch (error) {
    console.error('Error fetching horarios:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
