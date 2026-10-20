import { useState } from 'react';
import { PlusIcon, MapPinIcon, FlameIcon, ImageOffIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader.jsx';
import { Button } from '../components/Button.jsx';
import { StatusPill } from '../components/StatusPill.jsx';
import { IncidentMap } from '../components/map/IncidentMap.jsx';
import { CapacityBar } from '../components/evacuation/CapacityBar.jsx';
import { CenterDetailDrawer } from '../components/evacuation/CenterDetailDrawer.jsx';
import { CenterFormDialog } from '../components/evacuation/CenterFormDialog.jsx';
import { useAppData } from '../contexts/AppDataContext.jsx';
import { useToast } from '../components/ToastProvider.jsx';
import { centerStatusMeta, isActiveIncident } from '../utils/status.js';
import { distance, formatMeters } from '../utils/geo.js';
import { timeAgo } from '../utils/time.js';

export function EvacuationCenters() {
  const { centers, incidents, saveCenter, setCenterStatus } = useAppData();
  const { addToast } = useToast();
  const [filter, setFilter] = useState('all');
  const [viewingId, setViewingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [focus, setFocus] = useState(null);
  const active = incidents.filter((i) => isActiveIncident(i.status));
  const viewing = centers.find((c) => c.id === viewingId) ?? null;

  const nearest = (c) => (active.length ? Math.min(...active.map((i) => distance(i.position, c.position))) : null);
  const list = centers.filter((c) => filter === 'all' || c.status === filter);
  const totalCap = centers.filter((c) => c.status !== 'unavailable').reduce((s, c) => s + c.capacity, 0);
  const totalOcc = centers.reduce((s, c) => s + c.occupants, 0);

  const openForm = (c) => {
    setEditing(c);
    setFormOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Evacuation Centers"
        description="Monitor capacity and availability of fire evacuation centers in and around Barangay 69."
        actions={<Button leftIcon={<PlusIcon className="h-4 w-4" />} onClick={() => openForm(null)}>Create center</Button>}
      />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="panel p-3"><p className="eyebrow">Open capacity</p><p className="mt-1 text-2xl font-bold tabular-nums">{totalCap - totalOcc}</p><p className="text-xs text-neutral-text-muted">spaces available</p></div>
        <div className="panel p-3"><p className="eyebrow">Evacuees sheltered</p><p className="mt-1 text-2xl font-bold tabular-nums">{totalOcc}</p><p className="text-xs text-neutral-text-muted">across {centers.length} centers</p></div>
        <div className="panel p-3"><p className="eyebrow">Near capacity / full</p><p className="mt-1 text-2xl font-bold tabular-nums">{centers.filter((c) => c.status === 'near_capacity' || c.status === 'full').length}</p><p className="text-xs text-neutral-text-muted">need overflow planning</p></div>
        <div className="panel p-3"><p className="eyebrow">Unavailable</p><p className="mt-1 text-2xl font-bold tabular-nums">{centers.filter((c) => c.status === 'unavailable').length}</p><p className="text-xs text-neutral-text-muted">temporarily closed</p></div>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Filter by status">
        {['all', ...Object.keys(centerStatusMeta)].map((s) => (
          <button key={s} type="button" aria-pressed={filter === s} onClick={() => setFilter(s)} className={`chip ${filter === s ? 'border-neutral-active bg-neutral-active text-neutral-on-dark' : 'border-neutral-border bg-neutral-surface text-neutral-text-muted hover:bg-neutral-bg'}`}>
            {s === 'all' ? 'All' : centerStatusMeta[s].label}
            <span className="font-mono opacity-70">{s === 'all' ? centers.length : centers.filter((c) => c.status === s).length}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_440px]">
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {list.map((c) => {
            const d = nearest(c);
            return (
              <li key={c.id}>
                <button type="button" onClick={() => setViewingId(c.id)} className="panel block w-full overflow-hidden text-left transition-colors hover:border-neutral-text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-border">
                  <div className="relative aspect-[16/8] bg-neutral-bg">
                    {c.photos[0] ? <img src={c.photos[0]} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center border-b border-dashed border-neutral-border"><ImageOffIcon className="h-6 w-6 text-neutral-text-muted" aria-hidden="true" /></div>}
                    <span className="absolute left-2 top-2"><StatusPill meta={centerStatusMeta[c.status]} className="bg-neutral-surface" /></span>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-neutral-text">{c.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-neutral-text-muted"><MapPinIcon className="h-3 w-3" aria-hidden="true" />{c.address}</p>
                    <CapacityBar occupants={c.occupants} capacity={c.capacity} className="mt-3" />
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1 text-neutral-text-muted"><FlameIcon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />{d !== null ? `${formatMeters(d)} from nearest fire` : 'No active fires'}</span>
                      <span className="font-mono text-neutral-text-muted">Updated {timeAgo(c.lastUpdated)}</span>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="xl:sticky xl:top-20 xl:h-[calc(100vh-7rem)]">
          <IncidentMap className="h-[420px] xl:h-full" incidents={active} centers={centers} selectedCenterId={viewingId} onSelectCenter={setViewingId} focus={focus} />
        </div>
      </div>

      <CenterDetailDrawer
        center={viewing}
        nearestFireUnits={viewing ? nearest(viewing) : null}
        onClose={() => setViewingId(null)}
        onEdit={() => { const c = viewing; setViewingId(null); openForm(c); }}
        onViewOnMap={() => { if (viewing) setFocus({ point: viewing.position, key: Date.now() }); setViewingId(null); }}
        onStatus={(s) => viewing && setCenterStatus(viewing.id, s)}
        onSave={saveCenter}
      />
      <CenterFormDialog
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        center={editing}
        onSave={(c) => { saveCenter(c); addToast({ type: 'success', message: `${c.name} saved` }); }}
      />
    </div>
  );
}
