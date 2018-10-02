import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Mensaje } from '../interface/mensaje.interface';
//import { map } from  'rxjs / add / operator / map'
import { map } from 'rxjs/operators';

import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';



@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private itemsCollection: AngularFirestoreCollection<Mensaje>;

  public chats: Mensaje[] = [];
  public usuario: any = {};

  constructor(private afs: AngularFirestore,
              public afAuth: AngularFireAuth) { 

      this.afAuth.authState.subscribe( user => {
        console.log('Estado usuario: ', user);

        if(!user){
          return;
        }

        this.usuario.nombre = user.displayName;
        this.usuario.uid = user.uid;
        this.usuario.foto = user.photoURL;
      })

    }
   //Para los tipos de autenticación utilizados 
  login( proveedor:string) {

    if(proveedor == "google"){

      this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()); //Autenticación con google
    }else{
      this.afAuth.auth.signInWithPopup(new auth.TwitterAuthProvider()); //Autenticacin con twitter
    }
  }

  logout() {
    this.usuario = {};
    this.afAuth.auth.signOut();
  }

  cargarMensajes() {
    //obs lo que esta en firebase y ordena los mensajes
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc').limit(50));
    //pipe(map) trae los msm de firebase
    return this.itemsCollection.valueChanges().pipe(map((mensajes: Mensaje[]) => {
      console.log(mensajes);
      //this.chats = mensajes;
      //ordena los msm enviados
      this.chats = [];
      for (let mensajeLocal of mensajes) {
        this.chats.unshift(mensajeLocal); //inserta el elemento siempre en la primera posicion
      }
      return this.chats;
    }));
  }

  agregarMensaje(texto: string) {
    //TODO falta el uid del usuario
    let mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid,
      foto: this.usuario.foto,
    }
    return this.itemsCollection.add(mensaje);
  }
}
