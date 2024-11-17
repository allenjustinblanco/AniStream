export interface Anime {
  id: number;
  title: string;
  synopsis: string;
  image: string;
  genre: string[];
  episodes: number;
  rating: number;
  year: number;
}

export const animeData: Anime[] = [
  {
    id: 1,
    title: "Attack on Titan",
    synopsis: "Humanity fights for survival against giant humanoid creatures.",
    image: "https://placekitten.com/300/450",
    genre: ["Action", "Drama", "Fantasy"],
    episodes: 75,
    rating: 9.0,
    year: 2013
  },
  {
    id: 2,
    title: "Death Note",
    synopsis: "A high school student discovers a supernatural notebook.",
    image: "https://placekitten.com/301/450",
    genre: ["Thriller", "Supernatural"],
    episodes: 37,
    rating: 8.9,
    year: 2006
  },
  {
    id: 3,
    title: "One Punch Man",
    synopsis: "A superhero who can defeat any opponent with a single punch.",
    image: "https://placekitten.com/302/450",
    genre: ["Action", "Comedy"],
    episodes: 24,
    rating: 8.7,
    year: 2015
  },
  // Add more anime entries as needed
];

export const genres = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller"
];