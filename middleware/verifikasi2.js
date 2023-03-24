async function getPublicKey() {
    let publicKey = publicCache.get('publicKey');
    if (!publicKey) {
      // fetch public key from external source
      publicKey = await fetchPublicKey();
      publicCache.set('publicKey', publicKey);
    }
    return publicKey;
  }
  
  async function fetchPublicKey() {
    let publicES = fs.readFileSync(__dirname + '/ecdsa_public_key.pem','utf8');
    return publicES;
  }
  
  function verifikasi(role) {
    return async function(req, res, next) {
      const tokenWithBearer = req.headers.authorization;
      if (!tokenWithBearer) {
        return res.status(401).json({ auth: false, message: 'Token tidak tersedia!' });
      }
    
      const token = tokenWithBearer.split(' ')[1];
    
      try {
        const publicKey = await getPublicKey();
        const decoded = jwt.verify(token, publicKey);
    
        if (role !== 1) {
          return res.status(401).json({ auth: false, message: 'Gagal mengotorisasi role anda!' });
        }
    
        req.auth = decoded;
        next();
      } catch (err) {
        return res.status(401).json({ auth: false, message: err.message });
      }
    };
  }