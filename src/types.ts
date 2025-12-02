export type IconKey = 'supermarket' | 'store' | 'default';

export interface SavedLocation {
    lat: number;
    lng: number;
    name: string;
    icon: IconKey;
    date: string;
    category: string;
}

export interface NewLocationData {
    name: string;
    icon: IconKey;
    lat: number;
    lng: number;
    category: string;
}
