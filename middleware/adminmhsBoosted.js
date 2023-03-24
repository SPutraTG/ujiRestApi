exports.adminmahasiswa = async function (req, res) {
    try {
      const [rows, fields] = await pool.execute('SELECT nim, nama, jurusan FROM mahasiswa');
      response.ok(rows, res);
    } catch (error) {
      console.log(error);
    }
};