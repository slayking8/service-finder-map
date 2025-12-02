import React, { useState, useEffect } from 'react';
import type { NewLocationData, IconKey } from '../types';
import { iconsForModal } from '../config/icons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewLocationData) => void;
  coords: { lat: number; lng: number } | null;
}

export const AddLocationModal: React.FC<Props> = ({ isOpen, onClose, onSave, coords }) => {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<IconKey>('default');

  // Clear the state when the Model is closed
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setSelectedIcon('default');
    }
  }, [isOpen]);

  if (!isOpen || !coords) return null;

  const handleSave = () => {
    onSave({ name, icon: selectedIcon, lat: coords.lat, lng: coords.lng });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Adicionar Novo Local</h2>
        <input type="text" placeholder="Nome do local" value={name} onChange={(e) => setName(e.target.value)} autoFocus/>
        <p>Selecione um ícone:</p>
        <div className="icon-selector">
          {(Object.keys(iconsForModal) as Array<keyof typeof iconsForModal>).map((iconKey) => (
            <div
              key={iconKey}
              className={`icon-option ${selectedIcon === iconKey ? 'selected' : ''}`}
              onClick={() => setSelectedIcon(iconKey)}
              dangerouslySetInnerHTML={{ __html: iconsForModal[iconKey] }}
            />
          ))}
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-save" onClick={handleSave} disabled={!name.trim()}>Guardar</button>
        </div>
      </div>
    </div>
  );
};
