import { createInitialMockStore } from './buildMockStore.js';

const initial = createInitialMockStore();

export const currentUserId = initial.currentUser.id;
export const users = initial.users;
