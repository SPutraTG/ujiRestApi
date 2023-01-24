const jwt = require('jsonwebtoken');
const config = require('../config/secret');
const fs = require("fs");
let public = fs.readFileSync(__dirname + '/public_key.pem','utf8');
let publicES = fs.readFileSync(__dirname + '/ecdsa_public_key.pem','utf8');

function verifikasi(role){
    return function(req, rest, next){
        //cek authorizzation header
        var tokenWithBearer = req.headers.authorization;
        
        if(tokenWithBearer) {
            var token = tokenWithBearer.split(' ')[1];
            
            //verifikasi
            jwt.verify(token, publicES, function(err, decoded){
                if(err){
                    return rest.status(401).send({auth:false, message:'Token tidak terdaftar!'});
                }else {
                    if(role == 1){
                        req.auth = decoded;
                        next();
                    }else {
                        return rest.status(401).send({auth:false, message:'Gagal mengotorisasi role anda!'});
                    }
                }
            });
        }else {
            return rest.status(401).send({auth:false, message:'Token tidak tersedia!'});
        }
    }
}

module.exports = verifikasi