const fs = require('fs');
const path = require('path');

let { SSL, KEY, CERT, CA } = process.env;
let _ssl = SSL && `../${SSL}` || "ssl/";
let keyPath  = path.join( _ssl, ( KEY  && `../${KEY}` ) || "privkey.pem" );
let certPath = path.join( _ssl, ( CERT && `../${CERT}`) ||    "cert.pem" );
let caPath   = path.join( _ssl, ( CA   && `../${CA}`  ) ||   "chain.pem" );

console.log( keyPath, _ssl );
module.exports = {
  options: {
    key: 
      fs.readFileSync( path.join( __dirname, keyPath ) ),
    //fs.readFileSync(path.join(__dirname, "ssl", "privatekey.pem")),
    cert: 
      fs.readFileSync( path.join( __dirname, certPath) ),
    //fs.readFileSync(path.join(__dirname, "ssl", "certificate.pem")),
    ca: 
      fs.readFileSync( path.join( __dirname, caPath  ) ),
    //[fs.readFileSync(path.join(__dirname, "ssl", "certrequest.csr"))]
  }
};
