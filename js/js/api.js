// ====== API Wrapper ======
const API = (() => {
  const { GAS_API_URL, API_KEY } = window.APP_CONFIG;

  // ใช้ fetch + CORS (GAS รองรับ CORS ผ่าน redirect)
  async function call(action, data = {}) {
    const url = `${GAS_API_URL}?key=${encodeURIComponent(API_KEY)}&action=${encodeURIComponent(action)}`;
    
    try {
      const res = await fetch(url, {
        method: 'POST',
        // ใช้ text/plain เลี่ยง CORS preflight (GAS ไม่รับ OPTIONS)
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action, key: API_KEY, data }),
        redirect: 'follow'
      });

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
  };
})();
