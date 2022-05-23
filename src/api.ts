const API_KEY = "604d2f75779633393886327c93de99c2";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    name: string;
    overview: string;
    vote_count: number;
    vote_average: number;
    popularity: number;
    adult: boolean;
}

export interface ITv {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    name: string;
    overview: string;
}

export interface IGetMoviesResult {
    dates: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export interface ITvResult {
    dates: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: ITv[];
    total_pages: number;
    total_results: number;
}

export function getMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then((response) => response.json());
}

export function getLastMovies() {
    return fetch(`${BASE_PATH}/movie/latest?api_key=${API_KEY}`).then((response) => response.json());
}

export function getTopRatedMovies() {
    return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then((response) => response.json());
}

export function getUpcomingMovies() {
    return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then((response) => response.json());
}

export function getTvShows() {
    return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then((response) => response.json());
}

export function getLastTvShows() {
    return fetch(`${BASE_PATH}/tv/latest?api_key=${API_KEY}`).then((response) => response.json());
}

export function getAiringTodayTvShows() {
    return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then((response) => response.json());
}

export function getPopularShows() {
    return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((response) => response.json());
}
export function getTopRatedTvShows() {
    return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then((response) => response.json());
}

export const searchMovies = async (keyword?: string) => {
    return (await fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}`).then((response) => response.json())) || null;
};

export const searchTvShows = async (keyword?: string) => {
    return (await fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${keyword}`).then((response) => response.json())) || null;
};
