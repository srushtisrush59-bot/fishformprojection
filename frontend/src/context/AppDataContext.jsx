import { createContext, useContext, useMemo, useState } from 'react'
import { alertsSeed, camerasSeed, incidentsSeed } from '../data/sampleData'

const AppDataContext = createContext(null)

function uid(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`
}

export function AppDataProvider({ children }) {
  const [cameras, setCameras] = useState(camerasSeed)
  const [alerts, setAlerts] = useState(alertsSeed)
  const [incidents, setIncidents] = useState(incidentsSeed)
  const [zones, setZones] = useState([
    { id: 'zone-1', name: 'Pond 1 Protected Zone', cameraId: 'cam-1', cameraName: 'Pond 1', points: [[12,18],[58,16],[62,62],[10,66]], enabled: true },
    { id: 'zone-2', name: 'Pond 2 Protected Zone', cameraId: 'cam-2', cameraName: 'Pond 2', points: [[20,22],[70,20],[74,70],[18,72]], enabled: true },
  ])
  const [backendStatus, setBackendStatus] = useState({ connected: false, mode: 'Demo mode: using sample data and simulated device connections. Connect the FastAPI backend for live API/model output.' })

  const addCamera = (camera) => {
    const newCam = { id: uid('cam'), status: 'Offline', ...camera }
    setCameras(prev => [newCam, ...prev])
    return newCam
  }
  const removeCamera = (id) => setCameras(prev => prev.filter(c => c.id !== id))
  const updateCamera = (id, patch) => setCameras(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c))
  const testCameraConnection = async (id) => {
    updateCamera(id, { status: 'Testing' })
    await new Promise(r => setTimeout(r, 900))
    const online = Math.random() > 0.2
    updateCamera(id, { status: online ? 'Online' : 'Offline' })
    return online
  }

  const acknowledgeAlert = (id) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Acknowledged' } : a))
  const resolveAlert = (id) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Resolved' } : a))
  const addAlert = (alert) => setAlerts(prev => [{ id: uid('al'), status: 'Open', source: 'demo', ...alert }, ...prev])

  const addIncident = (incident) => {
    const item = { id: uid('in'), source: incident.source || 'demo', ...incident }
    setIncidents(prev => [item, ...prev])
    return item
  }

  const addZone = (zone) => setZones(prev => [{ id: uid('zone'), enabled: true, ...zone }, ...prev])
  const updateZone = (id, patch) => setZones(prev => prev.map(z => z.id === id ? { ...z, ...patch } : z))
  const removeZone = (id) => setZones(prev => prev.filter(z => z.id !== id))

  const stats = useMemo(() => {
    const totalCameras = cameras.length
    const activeCameras = cameras.filter(c => c.status === 'Online').length
    const totalPeople = incidents.filter(i => i.object === 'Person').length
    const animalIntrusions = incidents.filter(i => ['Dog','Animal'].includes(i.object) || /animal/i.test(i.eventType)).length
    const today = new Date().toISOString().slice(0,10)
    const todaysAlerts = alerts.filter(a => (a.dateTime || '').slice(0,10) === '2026-11-24').length // demo-today aligned to sample data
    const openAlerts = alerts.filter(a => a.status === 'Open').length
    return { totalCameras, activeCameras, totalPeople, animalIntrusions, todaysAlerts, openAlerts }
  }, [cameras, incidents, alerts])

  const value = useMemo(() => ({
    cameras, alerts, incidents, zones, stats, backendStatus,
    setBackendStatus, addCamera, removeCamera, updateCamera, testCameraConnection,
    acknowledgeAlert, resolveAlert, addAlert, addIncident, addZone, updateZone, removeZone,
  }), [cameras, alerts, incidents, zones, stats, backendStatus])

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}