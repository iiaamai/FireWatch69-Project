import { useRef, useState } from 'react';
import { UploadIcon, TrashIcon, PencilIcon, MapIcon, PhoneIcon, ImageOffIcon, MapPinIcon } from 'lucide-react';
import { Drawer } from '../Drawer.jsx';
import { Button } from '../Button.jsx';
import { ConfirmDialog } from '../ConfirmDialog.jsx';
import { CapacityBar } from './CapacityBar.jsx';
import { centerStatusMeta } from '../../utils/status.js';
import { formatDateTime } from '../../utils/time.js';
import { formatMeters } from '../../utils/geo.js';

export function CenterDetailDrawer({ center, nearestFireUnits, onClose, onEdit, onViewOnMap, onStatus, onSave }) {
  const fileRef = useRef(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [active, setActive] = useState(0);

  const upload = (files) => {
    if (!center || !files?.length) return;
    const urls = Array.from(files).filter((f) => f.type.startsWith('image/')).map((f) => URL.createObjectURL(f));
    onSave({ ...center, photos: [...center.photos, ...urls] });
  };

  return (
    <Drawer isOpen={Boolean(center)} onClose={onClose} position="right" size="lg">
      {center && (
        <div className="flex h-full flex-col bg-neutral-surface">
          <div className="border-b border-neutral-border p-5 pr-12">
            <p className="font-mono text-xs text-neutral-text-muted">{center.id}</p>
            <h2 className="text-xl font-bold text-neutral-text">{center.name}</h2>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-neutral-text-muted"><MapPinIcon className="h-3.5 w-3.5" aria-hidden="true" />{center.address}</p>
          </div>
          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Capacity', value: center.capacity },
                { label: 'Occupants', value: center.occupants },
                { label: 'Available', value: Math.max(0, center.capacity - center.occupants) },
              ].map((s) => (
                <div key={s.label} className="rounded-md border border-neutral-border p-3">
                  <p className="eyebrow">{s.label}</p>
                  <p className="mt-1 text-2xl font-bold tabular-nums text-neutral-text">{s.value}</p>
                </div>
              ))}
            </div>
            <CapacityBar occupants={center.occupants} capacity={center.capacity} />
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="eyebrow">Nearest active fire</dt><dd className="text-neutral-text">{nearestFireUnits !== null ? formatMeters(nearestFireUnits) : 'None'}</dd></div>
              <div><dt className="eyebrow">Last updated</dt><dd className="text-neutral-text">{formatDateTime(center.lastUpdated)}</dd></div>
              <div><dt className="eyebrow">Contact</dt><dd className="text-neutral-text">{center.contactPerson}</dd><dd><a className="flex items-center gap-1 font-mono text-xs text-neutral-text-muted hover:underline" href={`tel:${center.contactNumber}`}><PhoneIcon className="h-3 w-3" aria-hidden="true" />{center.contactNumber}</a></dd></div>
              <div><dt className="eyebrow">Facilities</dt><dd className="text-neutral-text-muted">{center.facilities.join(', ') || '—'}</dd></div>
            </dl>

            <div>
              <p className="eyebrow mb-2">Update status</p>
              <div className="grid grid-cols-2 gap-2" role="group" aria-label="Center status">
                {Object.keys(centerStatusMeta).map((s) => {
                  const meta = centerStatusMeta[s];
                  const Icon = meta.icon;
                  return (
                    <button key={s} type="button" aria-pressed={center.status === s} onClick={() => onStatus(s)} className={`chip justify-start py-2 ${center.status === s ? 'border-neutral-active bg-neutral-active text-neutral-on-dark' : 'border-neutral-border bg-neutral-surface text-neutral-text-muted hover:bg-neutral-bg'}`}>
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      {meta.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="eyebrow">Photos ({center.photos.length})</p>
                <Button size="small" variant="secondary" leftIcon={<UploadIcon className="h-3.5 w-3.5" />} onClick={() => fileRef.current?.click()}>Upload photos</Button>
                <input ref={fileRef} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { upload(e.target.files); e.target.value = ''; }} aria-label="Upload center photos" />
              </div>
              {center.photos.length ? (
                <>
                  <div className="overflow-hidden rounded-md border border-neutral-border bg-neutral-bg">
                    <img src={center.photos[Math.min(active, center.photos.length - 1)]} alt={`${center.name} photo ${active + 1}`} className="aspect-video w-full object-cover" />
                  </div>
                  <ul className="mt-2 grid grid-cols-4 gap-2">
                    {center.photos.map((p, i) => (
                      <li key={p + i} className="group relative">
                        <button type="button" onClick={() => setActive(i)} className={`block aspect-square w-full overflow-hidden rounded-md border-2 ${i === active ? 'border-neutral-active' : 'border-transparent'}`} aria-label={`Show photo ${i + 1}`}>
                          <img src={p} alt="" className="h-full w-full object-cover" />
                        </button>
                        <button type="button" onClick={() => setDeleteIndex(i)} className="absolute right-1 top-1 rounded bg-neutral-surface/90 p-1 text-neutral-text-muted opacity-0 hover:text-alert-critical-text focus:opacity-100 group-hover:opacity-100" aria-label={`Delete photo ${i + 1}`}>
                          <TrashIcon className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="flex flex-col items-center rounded-md border border-dashed border-neutral-border py-8 text-center">
                  <ImageOffIcon className="h-6 w-6 text-neutral-text-muted" aria-hidden="true" />
                  <p className="mt-2 text-sm text-neutral-text-muted">No photos yet</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 border-t border-neutral-border p-4">
            <Button variant="secondary" className="flex-1" leftIcon={<MapIcon className="h-4 w-4" />} onClick={onViewOnMap}>View on map</Button>
            <Button className="flex-1" leftIcon={<PencilIcon className="h-4 w-4" />} onClick={onEdit}>Edit center</Button>
          </div>

          <ConfirmDialog
            isOpen={deleteIndex !== null}
            onClose={() => setDeleteIndex(null)}
            onConfirm={() => {
              if (deleteIndex === null) return;
              onSave({ ...center, photos: center.photos.filter((_, i) => i !== deleteIndex) });
              setActive(0);
            }}
            title="Delete photo?"
            description="This photo will be permanently removed from the center’s gallery."
            confirmLabel="Delete photo"
            destructive
          />
        </div>
      )}
    </Drawer>
  );
}
