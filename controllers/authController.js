const Participant = require("../models/participant");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Pastikan dotenv diimport untuk memuat variabel lingkungan dari .env

console.log("JWT Secret:", process.env.JWT_SECRET); // Verifikasi kunci rahasia

exports.register = async (req, res) => {
  try {
    const {
      username,
      password,
      role,
      nama,
      idcard,
      nomorhp,
      pt,
      dept,
      lomba,
      badminton_type,
      team_name,
      player1,
      player2,
      player3,
      player4,
      player5,
      other_dept,
    } = req.body;

    console.log("Registering user with data:", req.body);

    // Buat data peserta baru
    const participantData = {
      username,
      password, // Kita akan meng-hash password di dalam metode create
      role,
      nama,
      idcard,
      nomorhp,
      pt,
      dept: dept === "Lainnya" ? other_dept : dept,
      lomba,
      badminton_type,
      team_name,
      player1,
      player2,
      player3,
      player4,
      player5,
    };

    // Tambahkan peserta baru menggunakan metode create dari kelas Participant
    const newParticipant = Participant.create(participantData);

    console.log("New participant registered:", newParticipant);

    res.redirect("/auth/login");
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("An error occurred during registration.");
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const participant = await Participant.findByUsername(username); // Menggunakan findByUsername dari model

    console.log("Participant found:", participant);

    if (!participant) {
      return res.status(401).send("Invalid username or password.");
    }

    const isMatch = await bcrypt.compare(password, participant.password); // Verifikasi password
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).send("Invalid username or password.");
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: participant.id, role: participant.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    // Simpan token di session
    req.session.token = token;
    req.session.user = participant;

    console.log("User logged in:", req.session.user); // Log untuk debugging

    // Redirect ke dashboard berdasarkan peran
    if (participant.role === "admin") {
      res.redirect("/admin/dashboard");
    } else {
      res.redirect("/user/dashboard");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("An error occurred during login.");
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).send("An error occurred during logout.");
    }
    console.log("User logged out successfully");
    res.redirect("/");
  });
};
