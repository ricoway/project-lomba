const { v4: uuidv4 } = require("uuid");
const Participant = require("../models/participant");
const fs = require("fs");
const path = require("path");

// Menampilkan dashboard admin
exports.dashboard = async (req, res) => {
  try {
    const participants = Participant.getParticipantsFromDatabase();
    res.render("dashboard-admin", { participants });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// Menambahkan peserta baru
exports.addParticipant = (req, res) => {
  try {
    const participantData = {
      id: uuidv4(),
      ...req.body,
      role: "user",
    };
    Participant.addParticipant(participantData);
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error adding participant:", error);
    res.status(500).send("An error occurred while adding participant.");
  }
};

// Memperbarui peserta
exports.editParticipant = (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    Participant.updateParticipant(id, updatedData);
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error editing participant:", error);
    res.status(500).send("An error occurred while editing participant.");
  }
};

// Menghapus peserta berdasarkan ID
exports.deleteParticipant = (req, res) => {
  const { id } = req.params;
  try {
    const deletedParticipant = Participant.deleteParticipant(id);
    if (deletedParticipant) {
      res.status(200).json(deletedParticipant);
    } else {
      res.status(404).json({ error: "Participant not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
