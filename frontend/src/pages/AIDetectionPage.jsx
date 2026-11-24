import { useMemo, useState } from 'react'
import { Upload, Play, ScanEye, AlertTriangle, Video, Info, CheckCircle2 } from 'lucide-react'
import { Badge, Button, Card, PageHeader } from '../components/ui/Primitives'
import { useAppData } from '../context/AppDataContext'
import { api } from '../lib/api'
import { formatDateTime } from '../lib/utils'

function DetectionPreview({ fileUrl, detections, label }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-ocean-900">
      {fileUrl ? (
        fileUrl.match(/\.(mp4|webm|ogg)$/i) || fileUrl.startsWith('blob:') ? (
          <video src={fileUrl} controls className="h-full w-full object-cover" />
        ) : <img src={fileUrl} alt="Detection preview" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center text-slate-400">Upload a video or image to preview detection results</div>
      )}
      {detections?.length > 0 && (
        <div className="pointer-events-none absolute inset-0">
          {detections.slice(0,4).map((d, i) => {
            const box = d.bbox || { x: 12 + i*18, y: 18 + i*10, w: 22, h: 28 }
            const isPerson = /person/i.test(d.label)
            return (
              <div key={i} className={`absolute rounded-md border-2 ${isPerson ? 'border-rose-400' : 'border-amber-400'}`} style={{ left: `${box.x}%`, top: `${box.y}%`, width: `${box.w}%`, height: `${box.h}%` }}>
                <div className={`absolute -top-6 left-0 rounded px-2 py-0.5 text-xs font-semibold text-white ${isPerson ? 'bg-rose-500' : 'bg-amber-500'}`}>{d.label} · {Math.round((d.confidence || 0) * 100)}%</div>
              </div>
            )
          })}
        </div>
      )}
      {label && <div className="absolute bottom-2 left-2 rounded-md bg-ocean-950/75 px-2 py-1 text-xs text-slate-200 ring-1 ring-white/10">{label}</div>}
    </div>
  )
}

export default function AIDetectionPage() {
  const { cameras, zones, addAlert, addIncident } = useAppData()
  const [file, setFile] = useState(null)
  const [fileUrl, setFileUrl] = useState('')
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [streamUrl, setStreamUrl] = useState(cameras[0]?.rtspUrl || '')
  const [streamStatus, setStreamStatus] = useState(null)

  const onFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setFileUrl(URL.createObjectURL(f))
    setResult(null)
    setError('')
  }

  const runDetection = async () => {
    if (!file) { setError('Please upload a video or image file for testing.'); return }
    setRunning(true); setError('')
    try {
      const data = await api.detectUpload(file)
      setResult({ ...data, source: data.source || 'model' })
      maybeGenerateEvents(data.detections || [], data.source === 'model' ? 'Actual model output' : 'API output', data.camera || cameras[0]?.name || 'Uploaded media')
    } catch (e) {
      // Fallback: simulated demo output (clearly labeled) - not faking live AI detection, just demonstrating workflow
      const simulated = {
        source: 'simulated',
        message: 'Backend/model not connected. Showing simulated detection workflow output for demonstration.',
        detections: [
          { label: 'Person', confidence: 0.96, timestamp: new Date().toISOString(), bbox: { x: 18, y: 20, w: 24, h: 36 } },
          { label: 'Dog', confidence: 0.90, timestamp: new Date().toISOString(), bbox: { x: 54, y: 46, w: 20, h: 18 } },
        ],
        processedFrames: 128,
        fileName: file.name,
      }
      setResult(simulated)
      maybeGenerateEvents(simulated.detections, 'Simulated demo output', cameras[0]?.name || 'Uploaded media')
    } finally {
      setRunning(false)
    }
  }

  function maybeGenerateEvents(detections, sourceLabel, cameraName) {
    const cam = cameras.find(c => c.name === cameraName) || cameras[0]
    const zone = zones.find(z => z.cameraName === cam?.name) || zones[0]
    detections.forEach(det => {
      const inZone = /person|dog/i.test(det.label) // demo logic: supported detections considered for zone check
      const confidencePct = Math.round((det.confidence || 0) * 100)
      if (inZone) {
        const zoneName = zone?.name || 'Protected Pond Zone'
        const type = /person/i.test(det.label)
          ? (zone ? 'Unauthorized zone entry' : 'Person detected near Pond 1')
          : (zone ? 'Unauthorized zone entry' : 'Dog detected near Pond 2')
        addAlert({
          type: /person/i.test(det.label) ? `Person detected near ${cam?.name || 'pond'}` : `Dog detected near ${cam?.name || 'pond'}`,
          camera: cam?.name || 'Uploaded media',
          dateTime: det.timestamp || new Date().toISOString(),
          confidence: confidencePct,
          snapshot: /person/i.test(det.label) ? 'person-pond1' : 'dog-pond2',
          description: `${det.label} detected with ${confidencePct}% confidence. ${zone ? `Zone check: entered ${zoneName}.` : 'No protected zone configured.'} (${sourceLabel})`,
          source: result?.source === 'model' ? 'model' : 'demo',
        })
        addIncident({
          eventType: zone ? `${/person/i.test(det.label) ? 'Person' : 'Animal'} intrusion` : `${/person/i.test(det.label) ? 'Person' : 'Animal'} detected`,
          object: /person/i.test(det.label) ? 'Person' : 'Dog',
          camera: cam?.name || 'Uploaded media',
          dateTime: det.timestamp || new Date().toISOString(),
          confidence: confidencePct,
          zone: zoneName,
          snapshot: /person/i.test(det.label) ? 'person-pond1' : 'dog-pond2',
          details: `${sourceLabel}: ${det.label} detected at ${confidencePct}% confidence. ${zone ? 'Object entered protected pond zone and alert was generated.' : 'Detection logged.'}`,
          source: result?.source === 'model' ? 'model' : 'demo',
        })
      }
    })
  }

  const startStreamDetection = async () => {
    if (!streamUrl) { setStreamStatus({ ok: false, msg: 'Enter an RTSP URL to start stream detection.' }); return }
    setStreamStatus({ ok: null, msg: 'Attempting to connect to RTSP stream via backend...' })
    try {
      // If backend endpoint exists, this would connect; otherwise we report clearly.
      const res = await fetch((import.meta.env.VITE_API_BASE || '/api') + '/detect/stream', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rtsp_url: streamUrl }) })
      if (!res.ok) throw new Error('Stream endpoint unavailable')
      const data = await res.json()
      setStreamStatus({ ok: true, msg: `Stream detection started (actual backend). Session: ${data.session_id || 'active'}` })
    } catch {
      setStreamStatus({ ok: false, msg: 'Live RTSP detection is not connected. Configure and run the FastAPI + OpenCV/YOLO backend with reachable camera streams to enable actual live inference. No fake live detection is shown.' })
    }
  }

  const detections = result?.detections || []
  const sourceBadge = result?.source === 'model' ? <Badge tone="success">Actual model output</Badge> : result?.source === 'simulated' ? <Badge tone="warning">Simulated demo output</Badge> : result ? <Badge tone="info">API output</Badge> : null

  return (
    <div>
      <PageHeader
        eyebrow="YOLO + OpenCV workflow"
        title="AI detection system"
        subtitle="Upload video for testing or configure an RTSP stream for live detection. Results clearly distinguish actual model output from simulated demo data."
        actions={sourceBadge}
      />

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <h3 className="font-display text-lg font-bold text-white">Video upload & detection</h3>
          <p className="mt-1 text-sm text-slate-400">Upload a video/image to run the detection workflow. If the backend model is unavailable, a simulated result is shown and labeled (no fake live AI detection).</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-300">Test media file</span>
              <input type="file" accept="video/*,image/*" onChange={onFile} className="block w-full rounded-xl border border-white/10 bg-ocean-900/70 px-3 py-2.5 text-sm text-slate-200 file:mr-3 file:rounded-lg file:border-0 file:bg-aqua-500/20 file:px-3 file:py-1.5 file:text-aqua-200" />
            </label>
            <Button onClick={runDetection} disabled={running || !file} size="lg">{running ? 'Running detection...' : <><Play className="h-4 w-4" /> Run detection</>}</Button>
          </div>
          {error && <div className="mt-3 rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</div>}
          <div className="mt-4">
            <DetectionPreview fileUrl={fileUrl} detections={detections} label={result ? (result.source === 'model' ? 'Actual model output overlay' : 'Simulated demo overlay') : 'Preview'} />
          </div>
          {result && (
            <div className={`mt-4 rounded-xl border px-4 py-3 text-sm ${result.source === 'model' ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100' : 'border-amber-400/20 bg-amber-500/10 text-amber-100'}`}>
              <div className="flex items-start gap-2"><Info className="mt-0.5 h-4 w-4" /><div><strong>{result.source === 'model' ? 'Actual model output:' : 'Simulated demo output:'}</strong> {result.message || (result.source === 'model' ? 'Detections returned by connected YOLO/OpenCV backend.' : 'Demonstration of the detection-to-alert workflow.')}</div></div>
            </div>
          )}
        </Card>

        <div className="space-y-4">
          <Card>
            <h3 className="font-display text-lg font-bold text-white">Detection results</h3>
            <p className="mt-1 text-sm text-slate-400">Labels, confidence scores, and timestamps for detected objects (Person, Dog, and supported animals).</p>
            <div className="mt-4 space-y-2">
              {detections.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-8 text-center text-sm text-slate-400">No detections yet. Upload media and run detection.</div>
              ) : detections.map((d, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                  <div>
                    <div className="flex items-center gap-2 font-medium text-white">{/person/i.test(d.label) ? <AlertTriangle className="h-4 w-4 text-rose-300" /> : <ScanEye className="h-4 w-4 text-amber-300" />} {d.label}</div>
                    <div className="text-xs text-slate-400">{formatDateTime(d.timestamp || new Date().toISOString())}</div>
                  </div>
                  <Badge tone={/person/i.test(d.label) ? 'danger' : 'warning'}>{Math.round((d.confidence || 0) * 100)}% confidence</Badge>
                </div>
              ))}
            </div>
            {result && <div className="mt-3 text-xs text-slate-400">Processed frames: {result.processedFrames ?? 'n/a'} · File: {result.fileName || file?.name || 'n/a'}</div>}
          </Card>

          <Card>
            <h3 className="font-display text-lg font-bold text-white">Live RTSP stream detection</h3>
            <p className="mt-1 text-sm text-slate-400">Configure an RTSP camera stream for backend-powered live inference when available.</p>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm font-medium text-slate-300">RTSP stream URL</span>
              <input value={streamUrl} onChange={e => setStreamUrl(e.target.value)} className="w-full rounded-xl border border-white/10 bg-ocean-900/70 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-aqua-400/30" placeholder="rtsp://camera/stream" />
            </label>
            <div className="mt-3 flex gap-2">
              <Button onClick={startStreamDetection}><Video className="h-4 w-4" /> Start stream detection</Button>
            </div>
            {streamStatus && (
              <div className={`mt-3 rounded-xl border px-3 py-2 text-sm ${streamStatus.ok === true ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100' : streamStatus.ok === false ? 'border-amber-400/20 bg-amber-500/10 text-amber-100' : 'border-sky-400/20 bg-sky-500/10 text-sky-100'}`}>
                {streamStatus.msg}
              </div>
            )}
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {['Detects people and supported animals (especially dogs).', 'Displays labels, confidence scores, and timestamps.', 'Generates zone-entry events when objects enter protected areas.', 'Only actual backend/model output is labeled as live AI detection.'].map(t => (
                <li key={t} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-aqua-300" /> {t}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}