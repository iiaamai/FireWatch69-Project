export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 640;

export const streets = [
  { id: 's1', name: 'Juan Luna St', points: [[150, 40], [150, 610]], major: true },
  { id: 's2', name: 'Herbosa St', points: [[360, 40], [360, 610]], major: true },
  { id: 's3', name: 'Velasquez St', points: [[570, 40], [570, 610]], major: true },
  { id: 's4', name: 'N. Zamora St', points: [[780, 40], [780, 610]], major: true },
  { id: 's5', name: 'Tayuman St', points: [[40, 130], [960, 130]], major: true },
  { id: 's6', name: 'Pritil St', points: [[40, 300], [960, 300]], major: true },
  { id: 's7', name: 'Moriones St', points: [[40, 470], [960, 470]], major: true },
];

export const alleys = [
  [[255, 130], [255, 470]],
  [[465, 130], [465, 300]],
  [[675, 300], [675, 610]],
  [[880, 130], [880, 470]],
  [[150, 215], [360, 215]],
  [[570, 385], [960, 385]],
  [[150, 545], [780, 545]],
  [[360, 385], [570, 385]],
];

export const boundary = [
  [95, 80],
  [900, 72],
  [915, 575],
  [110, 590],
];

export const blockColumns = [40, 150, 360, 570, 780, 960];
export const blockRows = [40, 130, 300, 470, 610];
