import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; 

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, default: Math.floor(100000*(Math.random())+999999) }, 
  firstPlayer: { type: String, default: null }, 
  secondPlayer: { type: String, default: null }
});

const Room = mongoose.model("roomModel", roomSchema);
export default Room;
