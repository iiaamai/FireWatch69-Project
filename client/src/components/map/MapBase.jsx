import { alleys, blockColumns, blockRows, boundary, MAP_HEIGHT, MAP_WIDTH, streets } from '../../data/mapLayout.js';

export function MapBase({ zoom }) {
  const blocks = [];
  for (let c = 0; c < blockColumns.length - 1; c++) {
    for (let r = 0; r < blockRows.length - 1; r++) {
      const x = blockColumns[c] + 12;
      const y = blockRows[r] + 12;
      blocks.push({ x, y, w: blockColumns[c + 1] - blockColumns[c] - 24, h: blockRows[r + 1] - blockRows[r] - 24 });
    }
  }
  const labelSize = 11 / Math.max(1, zoom * 0.8);

  return (
    <g aria-hidden="true">
      <rect x={0} y={0} width={MAP_WIDTH} height={MAP_HEIGHT} fill="#eef0f3" />
      <path d="M 975 0 C 955 160, 990 300, 965 440 S 975 600, 985 640 L 1000 640 L 1000 0 Z" fill="#dbe4ee" />
      <text x={968} y={330} fontSize={labelSize} fill="#7b8ba1" fontFamily="ui-monospace, Consolas, monospace" transform="rotate(90 968 330)">
        ESTERO DE VITAS
      </text>
      {blocks.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx={6} fill="#e2e5ea" />
      ))}
      {alleys.map((a, i) => (
        <polyline key={i} points={a.map((p) => p.join(',')).join(' ')} stroke="#f7f8fa" strokeWidth={5} fill="none" strokeLinecap="round" />
      ))}
      {streets.map((s) => (
        <polyline key={s.id} points={s.points.map((p) => p.join(',')).join(' ')} stroke="#ffffff" strokeWidth={14} fill="none" strokeLinecap="round" />
      ))}
      {streets.map((s) => {
        const [a, b] = s.points;
        const vertical = a[0] === b[0];
        const x = vertical ? a[0] + 4 : 60;
        const y = vertical ? 62 : a[1] - 10;
        return (
          <text
            key={`${s.id}-label`}
            x={x}
            y={y}
            fontSize={labelSize}
            fill="#6b7280"
            fontFamily="ui-monospace, Consolas, monospace"
            transform={vertical ? `rotate(90 ${x} ${y})` : undefined}
          >
            {s.name.toUpperCase()}
          </text>
        );
      })}
      <polygon
        points={boundary.map((p) => p.join(',')).join(' ')}
        fill="none"
        stroke="#4b5563"
        strokeWidth={1.5}
        strokeDasharray="8 6"
        vectorEffect="non-scaling-stroke"
      />
      <text x={104} y={100} fontSize={labelSize} fill="#4b5563" fontFamily="ui-monospace, Consolas, monospace" fontWeight={600}>
        BRGY. 69 BOUNDARY
      </text>
    </g>
  );
}
