const mongoose = require('mongoose');

const uri = 'mongodb+srv://okesh:21111512_Uk@cluster0.nl6ur.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Could not connect to MongoDB:', err);
  });
