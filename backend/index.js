// server/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import chatRouter from './routes/chat.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Route for handling chat messages
app.use('/api/chat', chatRouter);

const PORT = process.env.PORT || 5050;

try {
    app.listen(PORT, () => {
      console.log(`Backend listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server failed to start:", err);
  }
