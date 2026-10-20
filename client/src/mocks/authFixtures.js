// Matches server auth success shape for Layer C (docs/development_notes.txt).
export const MOCK_OFFICIAL_USER = {
  id: '671f00010000000000000001',
  fullName: 'Kgd. Leonora Ramos',
  email: 'l.ramos@brgy69.gov.ph',
  role: 'coordinator',
  accountStatus: 'active',
  phoneNumber: '09176901111',
  departmentOrTeam: 'Barangay 69 BDRRMC',
};

export const MOCK_ACCESS_TOKEN = 'mock-access-token-official';

export function mockLoginResponse(email, password) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  if (password.length < 8) {
    throw new Error('Invalid email or password');
  }
  return {
    success: true,
    data: {
      accessToken: MOCK_ACCESS_TOKEN,
      user: { ...MOCK_OFFICIAL_USER, email: email.toLowerCase() },
    },
  };
}

export function mockMeResponse() {
  return {
    success: true,
    data: { user: MOCK_OFFICIAL_USER },
  };
}
