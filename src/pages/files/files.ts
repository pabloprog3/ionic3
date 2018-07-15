import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { File } from "@ionic-native/file";
/**
 * Generated class for the FilesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-files',
  templateUrl: 'files.html',
})
export class FilesPage {

  fileName: string;
  fileContent: string;
  dirName: string;
  dirPath;


  constructor( public navCtrl: NavController, public file:File) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FilesPage');
  }

  
writeToFile(fileName,fileContents,dirName) {

  this.fileName = fileName;
  this.fileContent = fileContents;
  this.dirName = dirName;

  console.log ("File Name : " + this.fileName + "FileContent : " + fileContents + "Dir : " + this.dirName);

  let result = this.file.createDir(this.file.dataDirectory, this.dirName, true);

  result.then ( data => {
      this.dirPath = data.toURL();

      alert(" Directorio creado en : " + this.dirPath);

      this.file.writeFile(this.dirPath, this.fileName , this.fileContent , {replace: true });

      alert(" Archivo creado en : " + this.dirPath);

      let fileData = this.file.readAsText(this.dirPath , this.fileName);

      fileData.then(fData => {

          alert("File Data is : " + fData);
      }).catch(error => {
          alert("File read error : " + error);
      });

      //this.copyToLocation("Learning");


  }).catch(error => {
      alert(" Error : " + error );
  });
}
  copyToLocation(newDirName)

  {
      let result = this.file.createDir(this.file.dataDirectory, newDirName, true);

      result.then ( data => {

          let newPath = data.toURL();

          this.file.copyFile(this.dirPath, this.fileName, newPath, this.fileName );

          alert(" Archivo copiado en : " + newPath);

      }).catch(error => {
          alert(" Error : " + error );
      });
  }



}
