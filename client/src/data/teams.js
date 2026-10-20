import { createInitialMockStore } from './buildMockStore.js';

const initial = createInitialMockStore();

export const teams = initial.teams;
export const personnelPool = initial.personnelPool;
