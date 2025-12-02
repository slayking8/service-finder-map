import L from 'leaflet';
import type { IconKey } from '../types'; 

const svgStrings = {
    supermarket: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M13.35 10.48H4.5l-.24-1.25h9.13a1.24 1.24 0 0 0 1.22-1l.84-4a1.25 1.25 0 0 0-1.22-1.51H3l-.22-1.24H.5v1.25h1.25l1.5 7.84a2 2 0 0 0-1.54 1.93a2.09 2.09 0 0 0 2.16 2a2.08 2.08 0 0 0 2.13-2a2 2 0 0 0-.16-.77h5.49a2 2 0 0 0-.16.77a2.09 2.09 0 0 0 2.16 2a2 2 0 1 0 0-4zM14.23 4l-.84 4H4l-.74-4zM3.87 13.27A.85.85 0 0 1 3 12.5a.85.85 0 0 1 .91-.77a.84.84 0 0 1 .9.77a.84.84 0 0 1-.94.77m9.48 0a.85.85 0 0 1-.91-.77a.92.92 0 0 1 1.81 0a.85.85 0 0 1-.9.77"/></svg>`,
    store: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M2.49 12h4.33V7.66H2.49zm1.25-3.09h1.83v1.83H3.74zm7.33-1.25a2.43 2.43 0 0 0-2.43 2.43v3.4H9.9v-3.4a1.18 1.18 0 1 1 2.35 0v3.4h1.25v-3.4a2.43 2.43 0 0 0-2.43-2.43M2.49 5.07H13.5v1.3H2.49z"/><path fill="currentColor" d="M14.12 2.51H1.88A1.88 1.88 0 0 0 0 4.39v9.1h1.25v-9.1a.63.63 0 0 1 .63-.63h12.24a.63.63 0 0 1 .63.63v9.1H16v-9.1a1.88 1.88 0 0 0-1.88-1.88"/></svg>`,
};

// Export the strs to use in the Modal
export const iconsForModal = { ...svgStrings };

// Register the Icons in Leaflet
export const iconRegistry: Record<IconKey, L.DivIcon | L.Icon.Default> = {
    supermarket: new L.DivIcon({
        html: `<div class="icon-wrapper">${svgStrings.supermarket}</div>`,
        className: 'custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    }),
    store: new L.DivIcon({
        html: `<div class="icon-wrapper">${svgStrings.store}</div>`,
        className: 'custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    }),
    default: new L.Icon.Default()
};

// Export User Icon too
export const userIcon = new L.DivIcon({
    className: 'user-location-marker',
    html: `<div>Você</div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22]
});

// Export the Vite Icon config function
export const configureLeafletIcons = () => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
};
