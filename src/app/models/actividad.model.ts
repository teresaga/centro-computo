export class Actividad {
    constructor (
        public nombre: string,
        public tipoServicio: string,
        public cuentaEstudiante?: string,
        public grupo?: string,
        public carrera?: string,
        public equipo?: string,
        public marca?: string,
        public color?: string,
        public observaciones?: string,
        public fechaEntrada?: string,
        public fechaSalida?: string,
        public estatus?: string,
        public _id?: string
    ){}
}