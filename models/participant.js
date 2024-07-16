const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const dataPath = path.join(__dirname, "../data/data.json");

class Participant {
  static _readData() {
    try {
      const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
      console.log("Data read from file:", data);
      return data;
    } catch (error) {
      console.error("Error reading data from file:", error);
      return { participants: [] }; // Return empty structure if error occurs
    }
  }

  static _writeData(data) {
    try {
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf8");
      console.log("Data written to file:", data);
    } catch (error) {
      console.error("Error writing data to file:", error);
    }
  }

  static findByUsername(username) {
    const data = this._readData();
    const participant = data.participants.find(
      (participant) => participant.username === username,
    );
    console.log(`Searching for username "${username}" found:`, participant);
    return participant;
  }

  static findById(id) {
    const data = this._readData();
    const participant = data.participants.find(
      (participant) => participant.id === id,
    );
    console.log(`Searching for id "${id}" found:`, participant);
    return participant;
  }

  static create(participantData) {
    const data = this._readData();
    const existingParticipant = data.participants.find(
      (p) => p.username === participantData.username,
    );
    if (existingParticipant) {
      throw new Error("Participant with this username already exists.");
    }
    const hashedPassword = bcrypt.hashSync(participantData.password, 10);
    const newParticipant = {
      id: uuidv4(),
      ...participantData,
      password: hashedPassword,
    };
    data.participants.push(newParticipant);
    this._writeData(data);
    console.log("Participant created:", newParticipant);
    return newParticipant;
  }

  static addParticipant(participantData) {
    const data = this._readData();
    const newParticipant = {
      id: uuidv4(),
      ...participantData,
    };
    data.participants.push(newParticipant);
    this._writeData(data);
    return newParticipant;
  }

  static getParticipantsFromDatabase() {
    const data = this._readData();
    return data.participants.filter(
      (participant) => participant.role === "user",
    );
  }

  static updateParticipant(id, updatedData) {
    const data = this._readData();
    const index = data.participants.findIndex((p) => p.id === id);
    if (index !== -1) {
      if (updatedData.password) {
        updatedData.password = bcrypt.hashSync(updatedData.password, 10);
      }
      data.participants[index] = {
        ...data.participants[index],
        ...updatedData,
      };
      this._writeData(data);
      return data.participants[index];
    }
    return null;
  }

  static deleteParticipant(id) {
    const data = this._readData();
    const index = data.participants.findIndex((p) => p.id === id);
    if (index !== -1) {
      const deletedParticipant = data.participants.splice(index, 1)[0];
      this._writeData(data);
      return deletedParticipant;
    }
    return null;
  }
}

module.exports = Participant;
