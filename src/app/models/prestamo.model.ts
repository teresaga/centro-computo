export class Prestamo {
    constructor (
        public nombre: string,
        public cuentaEstudiante?: string,
        public grupo?: string,
        public carrera?: string,
        public fechaEntrada?: string,
        public fechaSalida?: string,
        public estatus?: string,
        public _id?: string
    ){}
}