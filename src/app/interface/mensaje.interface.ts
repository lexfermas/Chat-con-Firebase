export interface Mensaje{
    nombre: string;
    mensaje: string;
    fecha?: number;
    uid?: string;
    foto?: string;
}

//estos datos son recibidos dependiendo del tipo de autenticación (google, twitter) de cada usuario