import {User} from './User.model';

export class Ocorrencia {
    constructor (
        public tipo: string,
        public nomeOcorrencia: string,
        public local: string,
        public data: number,
        public url: string,
        public validado: boolean,
        public user: User,
        public id?: string) {}
}
