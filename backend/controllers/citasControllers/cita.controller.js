const db = require("../../models");
const Cita = db.Cita;

exports.create = async (req, res) => {
  try {
    if (!req.body.fecha || !req.body.HoraIni || !req.body.HoraFin || !req.body.estado ||
        !req.body.idAnimal || !req.body.idUsuario_programa || !req.body.idUsuario_atiende) {
      return res.status(400).send({
        message: "fecha, HoraIni, HoraFin, estado, idAnimal, idUsuario_programa e idUsuario_atiende son obligatorios."
      });
    }
    const data = await Cita.create(req.body);
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error creando Cita." });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await Cita.findAll();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error listando Citas." });
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Cita.findByPk(id);
    if (!data) return res.status(404).send({ message: `Cita no encontrada id=${id}` });
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ message: err.message || "Error obteniendo Cita." });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const [num] = await Cita.update(req.body, { where: { idCita: id } });
    if (num === 1) return res.send({ message: "Cita actualizada correctamente." });
    return res.send({ message: `No ha sido posible actualizar Cita id=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error actualizando Cita id=" + req.params.id });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const num = await Cita.destroy({ where: { idCita: id } });
    if (num === 1) return res.send({ message: "Cita eliminada correctamente." });
    return res.send({ message: `No ha sido posible eliminar Cita id=${id}.` });
  } catch (err) {
    return res.status(500).send({ message: "Error eliminando Cita id=" + req.params.id });
  }
};
