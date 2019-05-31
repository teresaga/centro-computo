export class Inventario {
    constructor (
        public descripcion: string,
        public tipo: string,
        public estatus: string,
        public modelo?: string,
        public serie?: string,
        public localizacion?: string,
        public personaAsignacion?: string,
        public fechaRegistro?: string,
        public observaciones?: string,
        public _id?: string
    ){}
}