export type Destination = {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
};

export type Route = {
    start: Destination;
    end: Destination;
    distance: number;
    duration: number;
};

