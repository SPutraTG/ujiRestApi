exports.login = async function (req, res) {
  const { password, email } = req.body;

  // validate inputs
  if (!password || !email) {
    res.status(400).json({ "Error": true, "Message": "Email dan password harus diisi!" });
    return;
  }

  try {
    // execute query using parameterized statement
    const queryText = 'SELECT id, username, password FROM user WHERE email = ?';
    const values = [email];
    const rows = await executeQuery(queryText, values);

    if (rows.length == 1) {
      const { id, username, password: hashedPassword } = rows[0];

      // compare hashed password with user input
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (passwordMatch) {
        // generate JWT token
        const token = jwt.sign({ id, username }, privateES, { algorithm: 'ES256', expiresIn: '2400000' });

        // insert access token to database
        const data = {
          id_user: id,
          access_token: token,
          ip_address: ip.address()
        };

        await executeQuery('INSERT INTO akses_token SET ?', [data]);

        // return response
        res.json({
          success: true,
          message: 'Token JWT tergenerate!',
          token,
          expires: 2400000,
          user: username
        });
      } else {
        res.status(400).json({ "Error": true, "Message": "Email atau password salah!" });
      }
    } else {
      res.status(400).json({ "Error": true, "Message": "Email atau password salah!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ "Error": true, "Message": "Terjadi kesalahan pada server!" });
  }
};