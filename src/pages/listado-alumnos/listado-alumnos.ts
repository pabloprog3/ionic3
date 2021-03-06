import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';

import { AlumnoServiceProvider } from "../../providers/alumno-service/alumno-service";

import { File } from "@ionic-native/file";
import { FilePath } from "@ionic-native/file-path";
import { FileChooser } from "@ionic-native/file-chooser";

import { Alumno } from "../../clases/alumno";

import { ConsultarBajaModifPage } from "../consultar-baja-modif/consultar-baja-modif";

@IonicPage()
@Component({
  selector: 'page-listado-alumnos',
  templateUrl: 'listado-alumnos.html',
})
export class ListadoAlumnosPage {

  public foto:string;
  public listado:Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private alumnoDB:AlumnoServiceProvider, public modalCtrl:ModalController,
              public file:File, public fileChooser:FileChooser, public filePath:FilePath,
              public alertCtrl:AlertController
  ) {}

  ionViewDidLoad() {
    this.listado = new Array<string>();
    this.foto="";
    this.alumnoDB.getAlumnosLista().subscribe(lista=>{
      this.listado = lista;
      console.log('lista alumnossss: ', this.listado);
    })

  }

  abrirModalView(alumno){
    console.log(alumno);
    //let consultaView = this.modalCtrl.create('ConsultarBajaModifPage', {'alumno':alumno});
    //consultaView.present();
    this.navCtrl.push(ConsultarBajaModifPage, {'alumno':alumno});
  }

  addNuevoAlumno(){
    this.navCtrl.push('AlumnosFormPage');
  }


  private cargarArchivos(){

        this.fileChooser.open().then(path=>{
          this.filePath.resolveNativePath(path).then(nativePath=>{
                this.file.readAsText(this.extraerPath(nativePath), this.extraerNombreArchivo(nativePath)).then(texto=>{
                    this.procesarContenidoCSV(texto);
                });
          });

        });
      }

  private procesarContenidoCSV(_texto:string){
          let campoLegajo:string='';
          let campoNombre:string='';
          let campoHorario:string='';

          let arrayListado:Array<string> = new Array<string>();

          let cont:number = 0;

            for (var i = 0; i < _texto.length; i++) {

              if ((_texto[i]==';') || (_texto[i]=='\n' && cont==2)) {
                cont += 1;
              }

              if (_texto[i]!=';') {
                switch (cont) {
                  case 0:
                          campoLegajo += _texto[i];
                  break;
                  case 1:
                          campoNombre += _texto[i];
                  break;
                  case 2:
                          campoHorario += _texto[i];

                  break;
                  case 3:
                      let alumno:Alumno = new Alumno();
                      alumno.setNombre(campoNombre);
                      alumno.setLegajo(campoLegajo);
                      alumno.setHorario(campoHorario);
                      alumno.setPerfil('alumno');
                      this.alumnoDB.guardarAlumno(alumno);

                      cont = 0;
                      campoLegajo = '';
                      campoNombre='';
                      campoHorario='';
                  break;
                }//fin switch
              }//fin if
            }//fin for
            this.navCtrl.pop();
  }

      private extraerPath(_path:string):string{
        let path:string='';
        let barraIDX:number = _path.lastIndexOf('/');
        path = _path.substring(0,barraIDX);
        path += '/';

        return path;
      }

      private extraerNombreArchivo(_path:string):string{
        let nombre:string='';
        let barraIDX:number = _path.lastIndexOf('/');
        nombre= _path.substring(barraIDX + 1);

        return nombre;
      }

      private extraerTipoFile(_path:string):string{
        let ext:string="";

        let puntoIDX:number = _path.lastIndexOf('.');
        ext=_path.substring(puntoIDX);

        return ext;
      }



}
