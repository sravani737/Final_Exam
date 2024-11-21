const express = require('express');
const dotenv = require('dotenv');
const mongoose =require('mongoose');
const moviesRoute = require('./routes/moviesRoute')
const userRoutes = require('./routes/userRoutes')
require('dotenv').config();
const cors = require('cors');
const authRoutes = require('./routes/auth')



const app = express();

app.use(express.json());
app.use(cors());


 
try {
    mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}


app.use('/api/v1/users',userRoutes)
app.use('/api/v1/movies',moviesRoute)
app.use('/api/v1', authRoutes);

const PORT  = process.env.PORT || 3000;

app.listen(PORT,()=>{
console.log(`server running on ${PORT}`);
})

