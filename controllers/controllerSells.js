const knex = require("../config/knexConfig");

exports.uploadSell = (req, res) => {
  const { userid, category, description, brand, size, color, sex, imgsURLs } =
    req.body;

  if (
    !userid ||
    !category ||
    !description ||
    !brand ||
    !size ||
    !color ||
    !sex
  ) {
    res.status(400).json({ error: `Faltan datos lol ${imgsURLs.length} ` });
    return;
  } else {
    knex("ventas")
      .insert({
        userid: userid,
        category: category,
        description: description,
        brand: brand,
        size: size,
        color: color,
        sex: sex,
        img1: imgsURLs[0],
        img2: imgsURLs[1],
        img3: imgsURLs[2],
        img4: imgsURLs[3],
      })
      .then(() => {
        res
          .json({
            success: true,
            mensaje: "La venta se ha registrado correctamente",
          })
          .catch((error) => {
            res.status(400).json({ error: error.message });
          });
      });
  }
};
