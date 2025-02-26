import dotenv from 'dotenv/config';  // Zorgt ervoor dat omgevingsvariabelen worden geladen
import express from 'express';
import cors from 'cors';

import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js'; 
import propertyRoutes from './routes/properties.js';  
import hostRoutes from './routes/hosts.js'; 
import amenityRoutes from './routes/amenities.js';  
import bookingRoutes from './routes/bookings.js';
import reviewRoutes from './routes/reviews.js';



const app = express();
app.use(cors());
app.use(express.json());

// Test route om te zien of de server draait
app.get('/test', (req, res) => {
  res.send('Test werkt!');
});

// Routes
app.use('/users', userRoutes);  // Route voor gebruikers
app.use('/login', authRoutes);   // Route voor login (gebruik '/login' voor authenticatie)
app.use('/properties', propertyRoutes);  // Voeg hier de properties route toe
app.use('/hosts', hostRoutes);  // Voeg de hosts route toe
app.use('/amenities', amenityRoutes);  // ✅ Routes voor voorzieningen
app.use('/bookings', bookingRoutes);  // Voeg de bookings route toe
app.use('/reviews', reviewRoutes);  // Voeg de review route toe



// Start de server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});
