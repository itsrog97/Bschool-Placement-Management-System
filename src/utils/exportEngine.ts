export function downloadCSV(filename: string, rows: Record<string, unknown>[], headers?: { key: string; label: string }[]) {
  if (!rows || !rows.length) {
    alert('No data available to export');
    return;
  }

  const keys = headers ? headers.map(h => h.key) : Object.keys(rows[0]);
  const headerLabels = headers ? headers.map(h => h.label) : keys;

  const csvContent = [
    headerLabels.map(escapeCSVField).join(','),
    ...rows.map(row => 
      keys.map(k => {
        const val = row[k];
        if (val === null || val === undefined) return '""';
        if (Array.isArray(val)) return escapeCSVField(val.join('; '));
        if (typeof val === 'object') return escapeCSVField(JSON.stringify(val));
        return escapeCSVField(String(val));
      }).join(',')
    )
  ].join('\r\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename.replace(/\.csv$/, '')}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCSVField(field: string): string {
  const clean = field.replace(/"/g, '""');
  return `"${clean}"`;
}
