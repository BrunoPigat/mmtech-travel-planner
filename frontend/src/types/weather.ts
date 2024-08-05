export interface WeatherData {
    temperature: number;
    weatherCode: number;
    weatherDescription: string;
}

export interface WeatherApiResponse {
    current_weather: {
        temperature: number;
        weathercode: number;
    };
}

export interface WeatherLocation {
    lat: number;
    lng: number;
    title: string;
}
