class Evento {
    constructor(
        public titulo: string,
        public descricao: string,
        public dataI: number,
        public dataF: number,
        public url: string,
        public id?: string) {}

}

export { Evento }
