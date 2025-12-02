import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLng } from 'leaflet';

import type { SavedLocation, NewLocationData, IconKey } from './types';
import { iconRegistry, userIcon, configureLeafletIcons } from './config/icons';

import { AddLocationModal } from './components/AddLocationModal';
import { Routing } from './components/Routing';
import { MapEvents } from './components/MapEvents';
import { SavedLocationPopup } from './components/SavedLocationPopup';


import './App.css';

configureLeafletIcons();

// Constants
const NAMPULA_CENTER: L.LatLngTuple = [-15.1175, 39.2666];
type MapMode = 'add' | 'route';

function App() {
    const [mode, setMode] = useState<MapMode>('add');
    const [waypoints, setWaypoints] = useState<LatLng[]>([]);
    const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
    const [userPosition, setUserPosition] = useState<L.LatLngTuple | null>(null);
    const [status, setStatus] = useState('Clique no mapa para adicionar um local.');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newLocationCoords, setNewLocationCoords] = useState<{ lat: number; lng: number } | null>(null);

    const [savedLocations, setSavedLocations] = useState<SavedLocation[]>(() => {
        const saved = localStorage.getItem('nampula_locations');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        const options: PositionOptions = {
            enableHighAccuracy: true, 
            timeout: 10000, 
            maximumAge: 0 // Don't use a cached location
        };

        const onSuccess = (pos: GeolocationPosition) => {
            const { latitude, longitude } = pos.coords;
            setUserPosition([latitude, longitude]);
        };

        const onError = (err: GeolocationPositionError) => {
            console.error(`ERRO DE GEOLOCALIZAÇÃO (${err.code}): ${err.message}`);

            let errorMessage = "Não foi possível obter a sua localização.";
            if (err.code === err.PERMISSION_DENIED) {
            errorMessage = "Permissão de localização negada. Verifique as definições do seu navegador.";
            } else if (err.code === err.POSITION_UNAVAILABLE) {
            errorMessage = "A informação de localização não está disponível.";
            } else if (err.code === err.TIMEOUT) {
            errorMessage = "O pedido de localização demorou demasiado tempo.";
            }

            setStatus(errorMessage);
        };

        // Asks for user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
        } else {
            setStatus("Geolocalização não é suportada por este navegador.");
        }

    }, []); 

    useEffect(() => {
        localStorage.setItem('nampula_locations', JSON.stringify(savedLocations));
    }, [savedLocations]);

    // --- Handlers ---
    const handleMapClick = (latlng: LatLng, currentMode: MapMode) => {
        if (currentMode === 'route') {
            if (waypoints.length < 2) {
                setWaypoints((prev) => [...prev, latlng]);
                setStatus(waypoints.length === 0 ? 'Selecione o ponto de chegada.' : 'Rota traçada!');
            }
        } else {
            setNewLocationCoords({ lat: latlng.lat, lng: latlng.lng });
            setIsModalOpen(true);
        }
    };

    const handleSaveLocation = (data: NewLocationData) => {
        const newLocation: SavedLocation = { ...data, date: new Date().toISOString() };
        setSavedLocations((prevLocations) => [...prevLocations, newLocation]);
        setStatus(`'${newLocation.name}' adicionado com sucesso!`);
    };

    const handleRouteToLocation = (destination: SavedLocation) => {
        if (!userPosition) {
            setStatus("Sua localização atual não está disponível para traçar a rota.");
            return;
        }

        const startPoint = L.latLng(userPosition[0], userPosition[1]);
        const endPoint = L.latLng(destination.lat, destination.lng);

        // Defines start and end route points 
        setWaypoints([startPoint, endPoint]);

        // Centralizes the map to show the whole route
        if (mapInstance) {
            const bounds = L.latLngBounds([startPoint, endPoint]);
            mapInstance.fitBounds(bounds.pad(0.2)); // pad(0.2) adiciona uma margem
        }

        setStatus(`A traçar rota para ${destination.name}.`);
    };

  // Delete a saved location
    const handleDeleteLocation = (locationId: string) => {
        setSavedLocations((prevLocations) => 
            prevLocations.filter(loc => loc.date !== locationId)
        );
        setStatus('Local removido com sucesso.');
    };

    const toggleRouteMode = () => {
        const newMode = mode === 'route' ? 'add' : 'route';
        setMode(newMode);
        setWaypoints([]); 
        setStatus(newMode === 'route' ?
              'Modo de Rota: Selecione o ponto de partida.' :
              'Clique no mapa para adicionar um local.'
        );
    };

    const clearRoute = () => {
        setWaypoints([]); 
        setStatus('Modo de Rota: Selecione o ponto de partida novamente.'); 
    };

    return (<>
        <AddLocationModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveLocation}
            coords={newLocationCoords}
        />


        <div className="header">
            <h1>Guide</h1>
            <div> 
                {mode === 'route' && waypoints.length > 0 && (
                    <button className="btn-clear-route" onClick={clearRoute}>
                        Limpar Rota
                    </button>
                )}
                <button className="btn-loc" onClick={toggleRouteMode}>
                    {mode === 'route' ? 'Cancelar' : 'Traçar Rota'}
                </button>
            </div>
        </div>

        <MapContainer 
            center={NAMPULA_CENTER}
            zoom={15}
            style={{ height: '100vh', width: '100vw' }}
            zoomControl={false}
            whenCreated={setMapInstance}
        >
        <TileLayer 
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {userPosition && <Marker position={userPosition} icon={userIcon}><Popup>Você está aqui!</Popup></Marker>}
        

        {/* Render locations */}
        {savedLocations.map((loc) => (
            <Marker 
                key={loc.date} 
                position={[loc.lat, loc.lng]} 
                icon={iconRegistry[loc.icon] || iconRegistry.default}
            >
                <SavedLocationPopup 
                    location={loc}
                    onDelete={handleDeleteLocation}
                    onRoute={handleRouteToLocation}
                />
            </Marker>
        ))}

        
        {waypoints.map((p, i) => <Marker key={`wp-${i}`} position={p} />)}

        <Routing waypoints={waypoints} />
        <MapEvents mode={mode} onMapClick={handleMapClick} />
        </MapContainer>

        <div className="status">{status}</div>
    </>);
}

export default App;
