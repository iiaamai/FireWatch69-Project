// Roles are proposals pending stakeholder validation (docs/document_acl.txt).
// Guests are handled via limited sessions, not User records (docs/model/user.txt).
export const ROLES = Object.freeze({
  SYSTEM_ADMIN: 'system_admin',
  BARANGAY_OFFICIAL: 'barangay_official',
  COORDINATOR: 'coordinator',
  RESPONDER: 'responder',
  REGISTERED_RESIDENT: 'registered_resident',
});

export const ROLE_VALUES = Object.freeze(Object.values(ROLES));

// Roles permitted to manage accounts in Phase 1 (docs/permissions_matrix.txt).
export const ACCOUNT_MANAGER_ROLES = Object.freeze([
  ROLES.SYSTEM_ADMIN,
  ROLES.BARANGAY_OFFICIAL,
]);

export const ACCOUNT_STATUS = Object.freeze({
  ACTIVE: 'active',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
  DISABLED: 'disabled',
});

export const ACCOUNT_STATUS_VALUES = Object.freeze(Object.values(ACCOUNT_STATUS));
