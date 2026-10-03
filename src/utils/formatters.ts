export function formatCurrencyLPA(lpa?: number): string {
  if (lpa === undefined || lpa === null) return '—';
  return `₹${lpa.toFixed(1)} LPA`;
}

export function formatStipend(stipend?: number): string {
  if (stipend === undefined || stipend === null) return '—';
  return `₹${stipend.toLocaleString('en-IN')}/mo`;
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatTime(timeString?: string): string {
  if (!timeString) return '';
  return timeString;
}

export function getCompanyStatusStyle(status: string): { bg: string; text: string; border: string } {
  switch (status) {
    case 'Confirmed':
    case 'Schedule Finalized':
    case 'Offer Released':
    case 'Converted':
      return { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' };
    case 'Hiring Active':
    case 'In Progress':
      return { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' };
    case 'Discussion':
    case 'Negotiation':
    case 'Interested':
      return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' };
    case 'On Hold':
    case 'Prospect':
    case 'Contacted':
      return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
    case 'Declined':
    case 'Cancelled':
      return { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
  }
}

export function getPlacementStatusStyle(status: string): { bg: string; text: string; border: string } {
  switch (status) {
    case 'Placed':
      return { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' };
    case 'Interviewing':
      return { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' };
    case 'Shortlisted':
      return { bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200' };
    case 'Unplaced':
      return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
    case 'Opted Out':
      return { bg: 'bg-zinc-100', text: 'text-zinc-600', border: 'border-zinc-200' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
  }
}

export function getPriorityStyle(priority: string): { bg: string; text: string } {
  switch (priority) {
    case 'HIGH':
      return { bg: 'bg-rose-50', text: 'text-rose-700' };
    case 'MEDIUM':
      return { bg: 'bg-amber-50', text: 'text-amber-700' };
    case 'LOW':
      return { bg: 'bg-slate-100', text: 'text-slate-600' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-600' };
  }
}
