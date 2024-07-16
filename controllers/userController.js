const Participant = require('../models/participant');

// Menampilkan dashboard user
exports.dashboard = (req, res) => {
  try {
    // Mengambil data pengguna dari session
    const participant = req.session.user;

    if (!participant) {
      return res.redirect('/auth/login');
    }

    // Menampilkan dashboard user dengan menyertakan data peserta
    res.render('dashboard-user', { participant });
  } catch (error) {
    console.error('Error displaying user dashboard:', error);
    res.status(500).send('An error occurred while displaying the dashboard.');
  }
};

// Registrasi peserta baru (untuk user mendaftar ke lomba)
exports.registerParticipant = (req, res) => {
  try {
    const participantData = {
      id: Date.now().toString(),
      ...req.body,
      username: req.user.username,  // Menyertakan username dari token
      role: 'user'
    };
    Participant.addParticipant(participantData);  // Menambahkan peserta baru
    res.redirect('/user/dashboard');
  } catch (error) {
    console.error('Error registering participant:', error);
    res.status(500).send('An error occurred while registering participant.');
  }
};
