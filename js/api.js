// ====== API Wrapper (แก้ CORS: ใช้ GET + query string) ======
const API = (() => {
  const { GAS_API_URL, API_KEY } = window.APP_CONFIG;

  // ✅ ใช้ GET + query string เท่านั้น → เป็น simple request → ไม่มี CORS preflight
  async function call(action, data = {}) {
    const params = new URLSearchParams();
    params.set('key', API_KEY);
    params.set('action', action);
    
    // แนบ data เป็น JSON string ใน query param
    if (Object.keys(data).length > 0) {
      params.set('data', JSON.stringify(data));
    }

    const url = `${GAS_API_URL}?${params.toString()}`;
    console.log(`[API] ${action} →`, url); // debug

    try {
      const res = await fetch(url, { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'API error');
      return json.data;
    } catch (err) {
      console.error(`[API ${action}]`, err);
      throw err;
    }
  }

  return {
    // อ่านข้อมูล
    getTransactions: (year, month) => call('getTransactions', { year, month }),
    getIncomes: (year, month) => call('getIncomes', { year, month }),
    getSummary: (year, month) => call('getSummary', { year, month }),
    getYearlySummary: (year) => call('getYearlySummary', { year }),
    getCategories: () => call('getCategories'),

    // รายจ่าย
    addTransaction: (d) => call('addTransaction', d),
    updateTransaction: (d) => call('updateTransaction', d),
    deleteTransaction: (id) => call('deleteTransaction', { id }),
    markAsPaid: (id) => call('markAsPaid', { id }),
    markAsUnpaid: (id) => call('markAsUnpaid', { id }),
    markAsNoBalance: (id) => call('markAsNoBalance', { id }),

    // รายรับ
    addIncome: (d) => call('addIncome', d),
    updateIncome: (d) => call('updateIncome', d),
    deleteIncome: (id) => call('deleteIncome', { id }),

    // สร้างเดือน
    generateForMonth: (year, month) => call('generateForMonth', { year, month })

    // เพิ่มใน return { ... } ของ API
    getDashboard: (year, month) => call('getDashboard', { year, month })
    };
})();
