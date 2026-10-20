export function LiveVideoPanel() {
  return (
    <section className="panel p-4" aria-labelledby="live-video-title">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="live-video-title" className="text-sm font-bold text-neutral-text">
          Live Incident Video
        </h2>
      </div>
      <div className="flex aspect-[16/10] items-center justify-center overflow-hidden rounded-md bg-neutral-bg">
        <p className="text-sm font-medium text-neutral-text-muted">Video coming soon</p>
      </div>
    </section>
  );
}
