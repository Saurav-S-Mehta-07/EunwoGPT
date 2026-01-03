import mongoose from 'mongoose';


const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timeStamp: {
    type: Date,
    default: Date.now
  }
});


const ThreadSchema = new mongoose.Schema({
  threadId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    default: "New Chat"
  },
  messages: [MessageSchema],
  user: {                 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("thread", ThreadSchema);
