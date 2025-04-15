import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axiosInstance from "../Network/axiosInstance.js";
import "leaflet/dist/leaflet.css";
import { connectSocket,getSocket,disconnectSocket } from "../Network/socket.js";
import { toast } from "sonner";

const Track = () => {
  const [guards, setGuards] = useState({});

  useEffect(() => {
    const socket = connectSocket(); 
    socket.on("getLocation", async ({ guardId, lat, lng }) => {
      if (!guardId) return toast.error("Socket Connection error");
      console.log(`✅ Received location update: Guard ${guardId} at [${lat}, ${lng}]`);
    
      try {
        setGuards((prev) => {
          const existingGuard = prev[guardId];
    
          if (!existingGuard) {
            axiosInstance.get(`/admin/getGuard/${guardId}`).then(({ data }) => {
              setGuards((prev) => ({
                ...prev,
                [guardId]: {
                  lat,
                  lng,
                  profilePhoto: data.profile_photo,
                  name: data.name,
                },
              }));
            }).catch((error) => {
              console.error("Error fetching guard details", error);
            });
    
            return prev;
          } else {
            return {
              ...prev,
              [guardId]: {
                ...existingGuard,
                lat,
                lng,
              },
            };
          }
        });
      } catch (error) {
        console.error("Error handling location update", error);
      }
    });
    
    
  
    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100vh", width: "100%" ,marginTop:'30px'}}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {Object.entries(guards).map(([guardId, { lat, lng, profilePhoto, name }]) => (
  <Marker
    key={`${guardId}-${lat}-${lng}`} // Updated to correctly access the lat/lng from the guard data
    position={[lat, lng]}
    icon={L.icon({
      iconUrl:`http://localhost:5000/uploads/profile_photos/${ profilePhoto}`,
      iconSize: [40, 40],
      className: "rounded-full border border-white",
    })}
  >
    <Popup>{name}</Popup>
  </Marker>
))}

    </MapContainer>
  );
};

export default Track;
