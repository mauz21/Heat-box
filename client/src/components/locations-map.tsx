import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Location } from '@shared/schema';
import L from 'leaflet';

// Fix for Leaflet default icon not showing
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationsMapProps {
  locations: Location[];
}

export function LocationsMap({ locations }: LocationsMapProps) {
  // Default center (can be adjusted or calculated based on locations bounds)
  const center = { lat: 40.7128, lng: -74.0060 }; // NYC default

  // If we have locations, center on the first one
  const mapCenter = locations.length > 0 
    ? { lat: Number(locations[0].latitude), lng: Number(locations[0].longitude) }
    : center;

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-inner border">
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((loc) => (
          <Marker 
            key={loc.id} 
            position={[Number(loc.latitude), Number(loc.longitude)]}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold font-display">{loc.name}</h3>
                <p className="text-sm">{loc.address}</p>
                <p className="text-sm text-muted-foreground mt-1">{loc.phone}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
