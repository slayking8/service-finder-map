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
  // --- Estados ---
  const [mode, setMode] = useState<MapMode>('add');
  const [waypoints, setWaypoints] = useState<LatLng[]>([]);
  const [userPosition, setUserPosition] = useState<L.LatLngTuple | null>(null);
  const [status, setStatus] = useState('Clique no mapa para adicionar um local.');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLocationCoords, setNewLocationCoords] = useState<{ lat: number; lng: number } | null>(null);

    // ... (todos os seus estados)
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>(() => {
    const saved = localStorage.getItem('nampula_locations');
    return saved ? JSON.parse(saved) : [];
  });
  /*
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>(() => {
    const saved = localStorage.getItem('nampula_locations');
    return saved ? JSON.parse(saved) : [];
  });
  */
  /*
  // --- Efeitos ---
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPosition([pos.coords.latitude, pos.coords.longitude]),
      () => console.error('Não foi possível obter a localização.')
    );
  }, []);
  *////

  // Dentro do componente App em src/App.tsx

  // --- Efeitos ---
  useEffect(() => {
    // Definimos as opções para a API de geolocalização
    const options: PositionOptions = {
      enableHighAccuracy: true, // Tenta obter a localização mais precisa possível
      timeout: 10000,           // Tempo máximo de 10 segundos para obter a localização
      maximumAge: 0             // Não usar uma localização em cache
    };

    // Função de sucesso
    const onSuccess = (pos: GeolocationPosition) => {
      const { latitude, longitude } = pos.coords;
      setUserPosition([latitude, longitude]);
      
      // Atualiza o status apenas se o utilizador não estiver noutro modo
      // if (mode === 'add') {
        // setStatus("Sua localização foi encontrada!");
      // }
    };

    // Função de erro - crucial para o diagnóstico
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

    // Solicita a localização
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    } else {
      setStatus("Geolocalização não é suportada por este navegador.");
    }

  }, []); // Adicionamos 'mode' como dependência para a lógica de status
  // }, [mode]); // Adicionamos 'mode' como dependência para a lógica de status

  /////////////////////////////////

  useEffect(() => {
    localStorage.setItem('nampula_locations', JSON.stringify(savedLocations));
  }, [savedLocations]);

  // --- Funções de Manipulação ---
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

  /*
  const handleSaveLocation = (data: NewLocationData) => {
    const newLocation: SavedLocation = { ...data, date: new Date().toISOString() };
    setSavedLocations((prev) => [...prev, newLocation]);
    setStatus(`'${newLocation.name}' adicionado com sucesso!`);
  }; */




    const handleSaveLocation = (data: NewLocationData) => {
    const newLocation: SavedLocation = { ...data, date: new Date().toISOString() };
    setSavedLocations((prevLocations) => [...prevLocations, newLocation]);
    setStatus(`'${newLocation.name}' adicionado com sucesso!`);
  };

  // NOVO: Função para remover um local
  const handleDeleteLocation = (locationId: string) => {
    setSavedLocations((prevLocations) => 
      prevLocations.filter(loc => loc.date !== locationId)
    );
    setStatus('Local removido com sucesso.');
  };


  // Dentro do componente App em src/App.tsx

  // --- Funções de Manipulação ---
  
  // ... (outras funções)

  const toggleRouteMode = () => {
    const newMode = mode === 'route' ? 'add' : 'route';
    setMode(newMode);
    setWaypoints([]); // Limpa a rota ao alternar
    setStatus(newMode === 'route' ? 'Modo de Rota: Selecione o ponto de partida.' : 'Clique no mapa para adicionar um local.');
  };

  // NOVA FUNÇÃO
  const clearRoute = () => {
    setWaypoints([]); // Limpa os pontos
    setStatus('Modo de Rota: Selecione o ponto de partida novamente.'); // Atualiza a mensagem
  };




  {/*
  const toggleMode = () => {
    const newMode = mode === 'add' ? 'route' : 'add';
    setMode(newMode);
    setWaypoints([]);
    setStatus(newMode === 'route' ? 'Modo de Rota: Selecione o ponto de partida.' : 'Clique no mapa para adicionar um local.');
  };
  */}

  return (
    <>
      <AddLocationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveLocation} coords={newLocationCoords} />
      
      {/*
      <div className="header">
        <h1>Zuri Assistent</h1>
        <button className="btn-loc" onClick={toggleMode}>
          {mode === 'add' ? 'Traçar Rota' : 'Adicionar Local'}
        </button>
      </div>
      */}

      <div className="header">
        <h1>Meu Diário de Nampula</h1>
        <div> {/* Usamos um div para agrupar os botões */}
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
      
      <MapContainer center={NAMPULA_CENTER} zoom={15} style={{ height: '100vh', width: '100vw' }} zoomControl={false}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {userPosition && <Marker position={userPosition} icon={userIcon}><Popup>Você está aqui!</Popup></Marker>}
        
        {/*
        {savedLocations.map((loc) => (
          <Marker key={`${loc.date}`} position={[loc.lat, loc.lng]} icon={iconRegistry[loc.icon] || iconRegistry.default}>
            <Popup><b>{loc.name}</b><br />{new Date(loc.date).toLocaleDateString('pt-MZ')}</Popup>
          </Marker>
        ))}
        */}


         {/* Renderização dos locais salvos agora usa o novo componente de Popup */}
        {savedLocations.map((loc) => (
          <Marker 
            key={loc.date} // A data continua a ser uma ótima key para o React
            position={[loc.lat, loc.lng]} 
            icon={iconRegistry[loc.icon] || iconRegistry.default}
          >
            <SavedLocationPopup location={loc} onDelete={handleDeleteLocation} />
          </Marker>
        ))}


        
        {waypoints.map((p, i) => <Marker key={`wp-${i}`} position={p} />)}
        
        <Routing waypoints={waypoints} />
        <MapEvents mode={mode} onMapClick={handleMapClick} />
      </MapContainer>
      
      <div className="status">{status}</div>
    </>
  );
}

export default App;
