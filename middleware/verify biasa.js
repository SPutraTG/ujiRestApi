const jwt = require('jsonwebtoken');
const fs = require("fs");
let publicES = fs.readFileSync(__dirname + '/ecdsa_public_key.pem','utf8');
let public = fs.readFileSync(__dirname + '/public_key.pem','utf8');

function asdasda(role){
    return function(req, res, next) {
        // Check authorization header
        const tokenWithBearer = req.headers.authorization;
        
        if (tokenWithBearer) {
          const token = tokenWithBearer.split(' ')[1];
          
          // Verify token
          jwt.verify(token, publicES, function(err, decoded) {
            if (err) {
              return res.status(401).json({ auth: false, message: 'Token tidak terdaftar!' });
            }
            
            // Check user's role
            if (role === 1) {
              req.auth = decoded;
              next();
            } else {
              return res.status(401).json({ auth: false, message: 'Gagal mengotorisasi role anda!' });
            }
          });
        } else {
          return res.status(401).json({ auth: false, message: 'Token tidak tersedia!' });
        }
      };
    }

module.exports = sadawsda;