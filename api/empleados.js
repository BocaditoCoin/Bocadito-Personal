module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const BASEROW_API = 'https://api.baserow.io/api';
    const AUTH_TOKEN = 'vZlkbz5gL9rL8J0eeuOZVDedcQ9oik3M';
    const TABLE_ID = '750037';

    // Paginación completa
    let allEmpleados = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
      const url = `${BASEROW_API}/database/rows/table/${TABLE_ID}/?user_field_names=true&size=200&page=${page}`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Token ${AUTH_TOKEN}` }
      });
      const data = await response.json();
      
      allEmpleados = [...allEmpleados, ...(data.results || [])];
      
      if (!data.next || (data.results || []).length === 0) {
        hasMore = false;
      } else {
        page++;
      }
    }
    
    // Filtrar empleados en nómina (excluir "Inactivo")
    const empleados = allEmpleados.filter(e => {
      const estado = (e['Estado'] || '').toLowerCase();
      return estado === 'en nómina' || estado === 'activo';
    });
    
    res.status(200).json({ success: true, empleados });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
