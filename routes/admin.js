const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const Participant = require("../models/participant");
const fs = require("fs"); // Tambahkan ini untuk mengimpor modul fs
const path = require("path"); // Tambahkan ini untuk mengimpor modul path
const ExcelJS = require("exceljs");

// Define the path to data.json
const dataFilePath = path.join(__dirname, '..', 'data', 'data.json');

// Function to read participant data
const getParticipants = () => {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data).participants;
};

// Route to get participant by ID
router.get('/participant/:id', (req, res) => {
    const participants = getParticipants();
    const participant = participants.find((p) => p.id === req.params.id);

    if (participant) {
        res.json(participant);
    } else {
        res.status(404).send('Participant not found');
    }
});

// Route to export to Excel
router.get('/export-excel', async (req, res) => {
    try {
        const data = getParticipants();

        if (!Array.isArray(data)) {
            throw new Error('Invalid data format');
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Peserta Lomba');

        worksheet.columns = [
            { header: 'Nama', key: 'nama', width: 30 },
            { header: 'ID Card', key: 'idcard', width: 20 },
            { header: 'Nomor HP', key: 'nomorhp', width: 20 },
            { header: 'PT', key: 'pt', width: 30 },
            { header: 'Departemen', key: 'dept', width: 20 },
            { header: 'Lomba', key: 'lomba', width: 20 },
            { header: 'Jenis Badminton', key: 'badminton_type', width: 20 },
            { header: 'Nama Tim', key: 'team_name', width: 20 },
            { header: 'Pemain 1', key: 'player1', width: 20 },
            { header: 'Pemain 2', key: 'player2', width: 20 },
            { header: 'Pemain 3', key: 'player3', width: 20 },
            { header: 'Pemain 4', key: 'player4', width: 20 },
            { header: 'Pemain 5', key: 'player5', width: 20 },
        ];

        data.forEach((participant) => {
            worksheet.addRow(participant);
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename=PesertaLomba.xlsx',
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error('Error generating Excel file:', err);
        res.status(500).send('Error generating Excel file');
    }
});

// Route to edit participant
router.post('/edit-participant', (req, res) => {
    const {
        id,
        nama,
        idcard,
        nomorhp,
        pt,
        dept,
        other_dept,
        lomba,
        badminton_type,
        team_name,
        player1,
        player2,
        player3,
        player4,
        player5,
    } = req.body;
    const participants = getParticipants();

    const participantIndex = participants.findIndex((p) => p.id === id);

    if (participantIndex !== -1) {
        participants[participantIndex] = {
            ...participants[participantIndex],
            nama,
            idcard,
            nomorhp,
            pt,
            dept: dept === 'Lainnya' ? other_dept : dept,
            lomba,
            badminton_type,
            team_name,
            player1,
            player2,
            player3,
            player4,
            player5,
        };

        fs.writeFileSync(dataFilePath, JSON.stringify({ participants }, null, 2));
        res.redirect('/admin/dashboard'); // Redirect to admin dashboard after editing
    } else {
        res.status(404).send('Participant not found');
    }
});

// Route to delete participant
router.get('/delete-participant/:id', (req, res) => {
    const participantId = req.params.id;
    const participants = getParticipants();

    const participantIndex = participants.findIndex((p) => p.id === participantId);

    if (participantIndex > -1) {
        participants.splice(participantIndex, 1);
        fs.writeFileSync(dataFilePath, JSON.stringify({ participants }, null, 2));
        res.redirect('/admin/dashboard');
    } else {
        res.status(404).send('Participant not found');
    }
});

// Other admin routes
router.get('/dashboard', adminController.dashboard);
router.post('/add-participant', adminController.addParticipant);
router.post('/edit-participant/:id', adminController.editParticipant);

module.exports = router;
