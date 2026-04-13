const express = require('express');
const mongoose = require('mongoose');


require('dotenv').config();

// routes
const folderRoutes = require('./routes/folderRoutes');
const fileRoutes = require('./routes/fileRoutes');
const path = require('path');


const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/storage', express.static(path.join(__dirname, '../storage')));

// routes middleware
app.use('/api/folders', folderRoutes);
app.use('/api/files', fileRoutes);

// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

module.exports = app;