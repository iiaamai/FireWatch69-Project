import { useState } from 'react';
import { PlayIcon, ImageIcon, ChevronLeftIcon, ChevronRightIcon, ShieldCheckIcon, XCircleIcon, MapPinIcon, ClockIcon, UserIcon, ImageOffIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../Dialog.jsx';
import { Button } from '../Button.jsx';
import { StatusPill } from '../StatusPill.jsx';
import { mediaStatusMeta } from '../../utils/status.js';
import { formatTime } from '../../utils/time.js';

export function MediaReviewPanel({ incident, onSetStatus }) {
  const [filter, setFilter] = useState('all');
  const [previewIndex, setPreviewIndex] = useState(null);
  const items = incident.media.filter((m) => filter === 'all' || m.status === filter);
  const current = previewIndex !== null ? items[previewIndex] : null;

  if (!incident.media.length) {
    return (
      <div className="flex flex-col items-center rounded-md border border-dashed border-neutral-border px-4 py-10 text-center">
        <ImageOffIcon className="h-6 w-6 text-neutral-text-muted" aria-hidden="true" />
        <p className="mt-2 text-sm font-medium text-neutral-text">No media submitted yet</p>
        <p className="text-xs text-neutral-text-muted">Resident photos and videos will appear here for review.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Filter media">
        {['all', 'pending', 'verified', 'rejected'].map((f) => {
          const count = f === 'all' ? incident.media.length : incident.media.filter((m) => m.status === f).length;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`chip ${filter === f ? 'border-neutral-active bg-neutral-active text-neutral-on-dark' : 'border-neutral-border bg-neutral-surface text-neutral-text-muted hover:bg-neutral-bg'}`}
            >
              {f === 'all' ? 'All' : mediaStatusMeta[f].label} <span className="font-mono opacity-70">{count}</span>
            </button>
          );
        })}
      </div>
      <ul className="grid grid-cols-2 gap-3">
        {items.map((m, i) => (
          <li key={m.id} className="overflow-hidden rounded-md border border-neutral-border bg-neutral-surface">
            <button type="button" onClick={() => setPreviewIndex(i)} className="relative block aspect-[4/3] w-full bg-neutral-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-border" aria-label={`Preview ${m.type} submitted ${formatTime(m.timestamp)}`}>
              <img src={m.url} alt="" className="h-full w-full object-cover" />
              <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded bg-black/65 px-1.5 py-0.5 font-mono text-[10px] uppercase text-neutral-on-dark">
                {m.type === 'video' ? <PlayIcon className="h-3 w-3" aria-hidden="true" /> : <ImageIcon className="h-3 w-3" aria-hidden="true" />}
                {m.type}
              </span>
              {m.type === 'video' && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-surface/90">
                    <PlayIcon className="h-4 w-4 text-neutral-text" aria-hidden="true" />
                  </span>
                </span>
              )}
            </button>
            <div className="space-y-1.5 p-2">
              <StatusPill meta={mediaStatusMeta[m.status]} />
              <p className="font-mono text-[11px] text-neutral-text-muted">
                {formatTime(m.timestamp)} · {m.location}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <Dialog isOpen={current !== null} onClose={() => setPreviewIndex(null)} size="lg">
        {current && previewIndex !== null && (
          <>
            <DialogHeader>
              Media review · {previewIndex + 1} of {items.length}
            </DialogHeader>
            <DialogContent>
              <div className="relative overflow-hidden rounded-md bg-neutral-active">
                <img src={current.url} alt={`${current.type} of fire at ${current.location}`} className="max-h-[60vh] w-full object-contain" />
                {current.type === 'video' && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-surface/90">
                      <PlayIcon className="h-6 w-6 text-neutral-text" aria-hidden="true" />
                    </span>
                  </span>
                )}
                <button type="button" onClick={() => setPreviewIndex((previewIndex - 1 + items.length) % items.length)} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-neutral-surface/90 p-2 hover:bg-neutral-surface" aria-label="Previous media">
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => setPreviewIndex((previewIndex + 1) % items.length)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-neutral-surface/90 p-2 hover:bg-neutral-surface" aria-label="Next media">
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
              <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-text-muted">
                <div className="flex items-center gap-1.5"><ClockIcon className="h-4 w-4 text-neutral-text-muted" aria-hidden="true" /><dt className="sr-only">Time</dt><dd>{formatTime(current.timestamp)}</dd></div>
                <div className="flex items-center gap-1.5"><MapPinIcon className="h-4 w-4 text-neutral-text-muted" aria-hidden="true" /><dt className="sr-only">Location</dt><dd>{current.location}</dd></div>
                <div className="flex items-center gap-1.5"><UserIcon className="h-4 w-4 text-neutral-text-muted" aria-hidden="true" /><dt className="sr-only">Submitted by</dt><dd>{current.submittedBy}</dd></div>
                <div><dt className="sr-only">Status</dt><dd><StatusPill meta={mediaStatusMeta[current.status]} /></dd></div>
              </dl>
            </DialogContent>
            <DialogFooter>
              <div className="flex w-full justify-end gap-2">
                <Button variant="secondary" leftIcon={<XCircleIcon className="h-4 w-4" />} disabled={current.status === 'rejected'} onClick={() => onSetStatus(current.id, 'rejected')}>
                  Reject
                </Button>
                <Button leftIcon={<ShieldCheckIcon className="h-4 w-4" />} disabled={current.status === 'verified'} onClick={() => onSetStatus(current.id, 'verified')}>
                  Verify media
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </Dialog>
    </div>
  );
}
