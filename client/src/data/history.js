import { createInitialMockStore } from './buildMockStore.js';

const initial = createInitialMockStore();

export const historicalIncidents = initial.history;
export const historyLocations = initial.historyLocations;
