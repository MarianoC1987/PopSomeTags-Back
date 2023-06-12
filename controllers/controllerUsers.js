const knex = require("../config/knexConfig");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Registro de usuario
exports.registerController = async (req, res) => {
  const { nombre, telefono, email, password, perfil } = req.body;

  const salt = await bcrypt.genSalt(10);
  const passwordEncrypt = await bcrypt.hash(password, salt);

  knex("usuarios")
    .where({ email: email })
    .then(async (resultado) => {
      if (resultado.length) {
        res.status(400).json({ error: "El email ya esta siendo utilizado" });
        return;
      }
      await knex("usuarios")
        .insert({
          nombre: nombre,
          email: email,
          telefono: telefono,
          password: passwordEncrypt,
          perfil: perfil,
        })
        .then(async () => {
          knex("usuarios")
            .where({ email: email })
            .then(async (resultado) => {
              const token = jwt.sign(
                {
                  nombre: resultado[0].nombre,
                  email: resultado[0].email,
                  id: resultado[0].usuarioId,
                  perfil: resultado[0].perfil,
                },
                process.env.TOKEN_SECRET
              );
              const user = {
                nombre: resultado[0].nombre,
                email: resultado[0].email,
                id: resultado[0].usuarioId,
                //perfil: resultado[0].perfil,
              };
              res.json({
                success: true,
                mensaje: "El usuario se ha registrado correctamente",
                token: token,
                user: user,
              });
            })
            .catch((error) => {
              return res.status(400).json({ error: error });
            });
        })
        .catch((error) => {
          res.status(400).json({ error: error.message });
        });
    })
    .catch((error) => {
      return res.status(400).json({ error: error });
    });
};

//Login de usuario
exports.loginController = (req, res) => {
  const { email, password } = req.body;
  knex("usuarios")
    .where({ email: email })
    .then(async (resultado) => {
      if (!resultado.length) {
        res.status(404).json({
          error: "Email y/o contraseña incorrecta/s",
        });
        return;
      }
      const validatePassword = await bcrypt.compare(
        password,
        resultado[0].password
      );
      if (!validatePassword) {
        res.status(404).json({
          error: "Email y/o contraseña incorrecta/s",
        });
        return;
      }
      const token = jwt.sign(
        {
          nombre: resultado[0].nombre,
          email: resultado[0].email,
          id: resultado[0].usuarioId,
          perfil: resultado[0].perfil,
        },
        process.env.TOKEN_SECRET
      );

      res.json({ success: true, token: token });
    })
    .catch((error) => {
      return res.status(400).json({ error: error });
    });
};

//Verificar el usuario que esta actualmente loggeado
exports.currentLoggedUser = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    res.status(401).json({ error: "No has iniciado sesion" });
    return;
  }
  try {
    const decodedUser = jwt.verify(token, process.env.TOKEN_SECRET);
    res.json({ user: decodedUser });
    next();
  } catch (error) {
    res.status(400).json({ error: "El token es invalido", mensaje: error });
  }
};

//LISTA DE todos los USUARIOS
exports.allUsers = (req, res) => {
  knex("usuarios")
    .then((respuesta) => {
      res.json(respuesta);
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

//Buscar un usuario especifico por ID
exports.searchId = (req, res) => {
  const { id } = req.params;
  knex("usuarios")
    .where("usuarios.usuarioId", id)
    .then((respuesta) => {
      res.json(respuesta[0]);
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

//Eliminar usuario
exports.deleteUser = (req, res) => {
  const id = req.params.id;
  knex("usuarios")
    .where("usuarioId", id)
    .returning("usuarioId")
    .del()
    .then((respuesta) => {
      knex("usuarios")
        .where("usuarioId", respuesta[0].usuarioId)
        .del()
        .then((respuesta) => {
          res.json({
            inmueble: respuesta[0],
            message: "Se ha eliminado el usuario correctamente",
          });
        });
    })

    .catch((error) => {
      res.status(400).json({
        error:
          "No se ha podido eliminar el usuario. Verifique y vuelva a intentar.",
      });
    });
};

//Editar info de usuario
exports.editUserInfo = (req, res) => {
  const id = req.params.id;
  const { nombre, email, perfil, telefono } = req.body;

  knex("usuarios")
    .where("usuarioId", id)
    .update({
      nombre: nombre,
      email: email,
      perfil: perfil,
      telefono: telefono,
    })
    .then((respuesta) => {
      res.json({
        message: "La informacion se ha actualizado correctamente",
      });
    })
    .catch((cualquiera) => {
      res.status(400).json({
        error:
          "No se ha podido actualizar la informacion de usuario. Verifique y vuelva a intentar.",
      });
    });
};
