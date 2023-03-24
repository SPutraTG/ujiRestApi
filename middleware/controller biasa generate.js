// controller untuk login
exports.login = function (req, res) {
    const { password, email } = req.body;
    const table = ["user", "password", md5(password), "email", email];
    const query = mysql.format("SELECT * FROM ?? WHERE ??=? AND ??=?", table);

 connection.query(query, function (error, rows) {
   if (error) {
     console.log(error);
     res.status(500).json({ "Error": true, "Message": "Terjadi kesalahan pada server!" });
   } else {
     if (rows.length == 1) {
       const { id, username } = rows[0];
       const token = jwt.sign({ id, username }, privateES, { algorithm: 'ES256', expiresIn: '2400000' });
       const data = {
         id_user: id,
         access_token: token,
         ip_address: ip.address()
       };

       const insertQuery = mysql.format("INSERT INTO ?? SET ?", ["akses_token"]);
       connection.query(insertQuery, data, function (error, rows) {
         if (error) {
           console.log(error);
           res.status(500).json({ "Error": true, "Message": "Terjadi kesalahan pada server!" });
         } else {
           res.json({
             success: true,
             message: 'Token JWT tergenerate!',
             token: token,
             expires: 2400000,
             user: username
           });
         }
       });
     } else {
       res.status(400).json({ "Error": true, "Message": "Email atau password salah!" });
     }
   }
 });
};