export const manifest = {
  screens: {
    scr_tnyfml: { name: 'Login', route: '/login', state: { signedIn: false }, position: { x: 160, y: 220 } },
    scr_2dpv0b: { name: 'Dashboard', route: '/', position: { x: 160, y: 2200 } },
    scr_b7mm6x: { name: 'Manage Fire Incidents', route: '/incidents', position: { x: 160, y: 4180 } },
    scr_zrqkj1: { name: 'Incident Details', route: '/incidents', state: { incidentId: '671f00040000000000000001' }, position: { x: 1560, y: 4180 } },
    scr_m5m2en: { name: 'Track Responders', route: '/responders', position: { x: 160, y: 6160 } },
    scr_1r5tb3: { name: 'Responder Selected', route: '/responders', state: { teamId: 'T-E1' }, position: { x: 1560, y: 6160 } },
    scr_52r7ei: { name: 'Team Management', route: '/teams', position: { x: 160, y: 8140 } },
    scr_a49wxv: { name: 'Evacuation Centers', route: '/evacuation', position: { x: 160, y: 12100 } },
    scr_sta009: { name: 'Fire Incident History', route: '/history', position: { x: 160, y: 14080 } },
    scr_nio1ke: { name: 'Analytics & Reports', route: '/analytics', position: { x: 1560, y: 14080 } },
    scr_cdln09: { name: 'Fire Incident Heatmap', route: '/heatmap', position: { x: 2960, y: 14080 } },
    scr_025ul4: { name: 'Notifications', route: '/notifications', position: { x: 160, y: 16060 } },
    scr_e2veke: { name: 'Activity Logs', route: '/logs', position: { x: 1560, y: 16060 } },
    scr_plr1e2: { name: 'Manage Users', route: '/users', position: { x: 160, y: 10120 } },
    scr_m5wnd1: { name: 'Account', route: '/account', position: { x: 160, y: 18040 } },
  },
};

export default manifest;
