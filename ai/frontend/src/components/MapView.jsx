import { useEffect } from 'react'
import L from 'leaflet'
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { formatTime } from '../lib/format'

const markerColors = { READY: '#3f9a52', BAKING: '#e0a321', SCHEDULED: '#a8948a' }

function createMarkerIcon(color) {
  return L.divIcon({
    className: '',
    html: `<span class="map-pin" style="background:${color}"></span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -26],
  })
}

function Recenter({ center }) {
  const map = useMap()
  const [lat, lng] = center

  useEffect(() => {
    map.setView([lat, lng])
  }, [map, lat, lng])

  return null
}

export default function MapView({ establishments, center }) {
  return (
    <div className="map-frame">
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <Recenter center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CircleMarker center={center} radius={7} pathOptions={{ color: '#fff', weight: 2, fillColor: '#2f6fe0', fillOpacity: 1 }}>
          <Popup>Você está aqui</Popup>
        </CircleMarker>
        {establishments.map((establishment) => {
          const readySchedule = establishment.fornadas.find((schedule) => schedule.status === 'READY')
          const nextSchedule = readySchedule ?? establishment.fornadas[0]

          return (
            <Marker key={establishment.id} position={[establishment.lat, establishment.lng]} icon={createMarkerIcon(markerColors[nextSchedule?.status] ?? markerColors.SCHEDULED)}>
              <Popup>
                <strong>{establishment.nome}</strong><br />
                {establishment.endereco}<br />
                {readySchedule
                  ? <span style={{ color: '#317c42', fontWeight: 700 }}>{readySchedule.produto.nome} quentinho agora!</span>
                  : nextSchedule
                    ? <span>Próxima fornada: {formatTime(nextSchedule.horario_previsto)}</span>
                    : <span>Sem fornadas previstas</span>}
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
