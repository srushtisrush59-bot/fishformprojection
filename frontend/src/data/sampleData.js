export const camerasSeed = [
  { id: 'cam-1', name: 'Pond 1', location: 'North Pond Perimeter', rtspUrl: 'rtsp://demo.aquashield.local/pond1', status: 'Online', zone: 'Pond 1 Protected Zone' },
  { id: 'cam-2', name: 'Pond 2', location: 'East Pond Walkway', rtspUrl: 'rtsp://demo.aquashield.local/pond2', status: 'Online', zone: 'Pond 2 Protected Zone' },
  { id: 'cam-3', name: 'Storage Area', location: 'Feed & Equipment Storage', rtspUrl: 'rtsp://demo.aquashield.local/storage', status: 'Offline', zone: 'Storage Perimeter' },
  { id: 'cam-4', name: 'Main Entrance', location: 'Farm Gate', rtspUrl: 'rtsp://demo.aquashield.local/entrance', status: 'Online', zone: 'Entrance Watch Zone' },
]

export const alertsSeed = [
  { id: 'al-1', type: 'Unauthorized zone entry', camera: 'Pond 1', dateTime: '2026-11-24T20:42:00+05:30', confidence: 97, status: 'Open', snapshot: 'person-pond1', description: 'Person entered Pond 1 protected zone.', source: 'demo' },
  { id: 'al-2', type: 'Person detected near Pond 1', camera: 'Pond 1', dateTime: '2026-11-24T19:18:00+05:30', confidence: 94, status: 'Acknowledged', snapshot: 'person-pond1', description: 'Person detected close to pond boundary.', source: 'demo' },
  { id: 'al-3', type: 'Dog detected near Pond 2', camera: 'Pond 2', dateTime: '2026-11-24T17:05:00+05:30', confidence: 91, status: 'Resolved', snapshot: 'dog-pond2', description: 'Dog detected near feeding edge.', source: 'demo' },
  { id: 'al-4', type: 'Camera disconnected', camera: 'Storage Area', dateTime: '2026-11-24T15:30:00+05:30', confidence: null, status: 'Open', snapshot: 'camera-offline', description: 'RTSP stream heartbeat lost.', source: 'demo' },
  { id: 'al-5', type: 'Unauthorized zone entry', camera: 'Pond 2', dateTime: '2026-11-23T21:10:00+05:30', confidence: 89, status: 'Resolved', snapshot: 'dog-pond2', description: 'Animal crossed protected pond zone boundary.', source: 'demo' },
]

export const incidentsSeed = [
  { id: 'in-1', eventType: 'Person intrusion', object: 'Person', camera: 'Pond 1', dateTime: '2026-11-24T20:42:00+05:30', confidence: 97, zone: 'Pond 1 Protected Zone', snapshot: 'person-pond1', details: 'Detected person crossed protected zone boundary; alert generated and operator notified.', source: 'demo' },
  { id: 'in-2', eventType: 'Person detected', object: 'Person', camera: 'Pond 1', dateTime: '2026-11-24T19:18:00+05:30', confidence: 94, zone: 'Pond 1 Perimeter', snapshot: 'person-pond1', details: 'Person detected near pond edge outside core zone.', source: 'demo' },
  { id: 'in-3', eventType: 'Animal intrusion', object: 'Dog', camera: 'Pond 2', dateTime: '2026-11-24T17:05:00+05:30', confidence: 91, zone: 'Pond 2 Protected Zone', snapshot: 'dog-pond2', details: 'Dog detected and entered marked protected area.', source: 'demo' },
  { id: 'in-4', eventType: 'Animal intrusion', object: 'Dog', camera: 'Pond 2', dateTime: '2026-11-23T21:10:00+05:30', confidence: 89, zone: 'Pond 2 Protected Zone', snapshot: 'dog-pond2', details: 'Nighttime animal entry detected by AI model.', source: 'demo' },
  { id: 'in-5', eventType: 'Perimeter activity', object: 'Person', camera: 'Main Entrance', dateTime: '2026-11-23T18:22:00+05:30', confidence: 93, zone: 'Entrance Watch Zone', snapshot: 'person-entrance', details: 'Authorized-hours activity logged for review.', source: 'demo' },
  { id: 'in-6', eventType: 'Camera offline', object: 'System', camera: 'Storage Area', dateTime: '2026-11-24T15:30:00+05:30', confidence: null, zone: 'Storage Perimeter', snapshot: 'camera-offline', details: 'Camera disconnected; monitoring interrupted.', source: 'demo' },
]

export const weeklyAnalytics = [
  { name: 'Mon', people: 4, animals: 1, alerts: 3 },
  { name: 'Tue', people: 6, animals: 2, alerts: 5 },
  { name: 'Wed', people: 3, animals: 1, alerts: 2 },
  { name: 'Thu', people: 7, animals: 3, alerts: 6 },
  { name: 'Fri', people: 5, animals: 2, alerts: 4 },
  { name: 'Sat', people: 8, animals: 4, alerts: 7 },
  { name: 'Sun', people: 4, animals: 2, alerts: 3 },
]

export const monthlyAnalytics = [
  { name: 'Week 1', detections: 18 },
  { name: 'Week 2', detections: 24 },
  { name: 'Week 3', detections: 21 },
  { name: 'Week 4', detections: 30 },
]

export const demoDetections = [
  { id: 'd1', label: 'Person', confidence: 0.97, time: '20:42:08', camera: 'Pond 1', inZone: true },
  { id: 'd2', label: 'Dog', confidence: 0.91, time: '17:05:31', camera: 'Pond 2', inZone: true },
  { id: 'd3', label: 'Person', confidence: 0.88, time: '18:22:14', camera: 'Main Entrance', inZone: false },
]