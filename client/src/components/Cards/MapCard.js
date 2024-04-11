import { TileLayer , MapContainer , Marker , Popup } from "react-leaflet"
import "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import "./Cards.css";


export default function MapCard({ad}) {
  if (!ad || !ad.location) {
    console.log("Invalid ad or location:", ad);
    return null;
  }
  
  if (!ad.location.coordinates || !Array.isArray(ad.location.coordinates)) {
    console.log("Invalid coordinates:", ad.location);
    return null;
  }
  
 console.log(ad);
  const [longitude,latitude] = ad.location.coordinates;
  console.log(ad.location.coordinates[0])
  console.log("Latitude:", ad.location.coordinates[0]);
  console.log("Longitude:", longitude);

  return (
    <MapContainer center={[latitude,longitude]} zoom={ 16 } scrollWheelZoom={true}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />

    <Marker position={[latitude,longitude]}>
        <Popup>
       {ad.city}
        </Popup>    
        <span className="lead">📍</span>  
    </Marker>
  </MapContainer>
  )
}