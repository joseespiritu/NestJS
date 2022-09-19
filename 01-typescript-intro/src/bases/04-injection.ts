import { Move, PokeapiResponse } from '../interfaces/pokeapi-response.interface';
import { PokeapiAdapter, PokeApiFetchAdapter, HttpAdapter } from '../api/pokeApi.adapter';

export class Pokemon {

    get imageUrl(): string {
        return `https://pokemon.com/${this.id}.jpg`;
    }

    constructor( 
        public readonly id: number,
        public name: string,
        private readonly http: HttpAdapter
    ) {}

    scream() {
        console.log(`${this.name.toUpperCase()}!!!`);
    }

    speak() {
        console.log(`${this.name}, ${this.name}`);
    }

    async getMoves(): Promise<Move[]> {
        // const { data } = await axios.get<PokeapiResponse>('https://pokeapi.co/api/v2/pokemon/4');
        const data = await this.http.get<PokeapiResponse>('https://pokeapi.co/api/v2/pokemon/4');
        console.log(data.moves);

        return data.moves;
    }

}

const pokeApiAxios = new PokeapiAdapter();
const pokeApiFetch = new PokeApiFetchAdapter();

export const charmander = new Pokemon(4, 'Charmander', pokeApiFetch);

// charmander.id = 10;
// charmander.name = 'Hola';
// console.log(charmander);
// console.log(charmander.imageUrl);
// charmander.scream();
// charmander.speak();

// console.log(charmander.getMoves());
charmander.getMoves();