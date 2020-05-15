var admin = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "PASTE HERE YOUR URL PROJECT LINK"
});

const firestore = admin.firestore();
const path = require('path');
const fs = require('fs');
const directoryPath = path.join(__dirname, 'files');


fs.readdir(directoryPath, function(err, files){
  if(err){
    return console.log('Unable to scan directory: ' + err);
  }

  files.forEach(function(file){
    var lastDotIndex = file.lastIndexOf('.');
    var filesToUpload = require('./files/' + file);

    filesToUpload.forEach(function(obj){
      firestore
        .collection(file.substring(0, lastDotIndex))
        .doc(obj._id) // replace the '_id' with the field by which you want to identify your document
        .set(obj)
        .then(function(docRef){
          console.log('Document written');
        })
        .catch(function(error){
          console.error('Error adding document: ', error);
        });
    });
  });
});