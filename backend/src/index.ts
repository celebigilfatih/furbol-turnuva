import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import teamRoutes from './routes/team';
import tournamentRoutes from './routes/tournament';
import matchRoutes from './routes/match';
import playerRoutes from './routes/player';

// Routes will be imported here
// import matchRoutes from './routes/match';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/football-tournament';

console.log('Connecting to MongoDB at:', MONGODB_URI);

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
})
.then(() => {
  console.log('Connected to MongoDB successfully');
  console.log('Connection state:', mongoose.connection.readyState);
  console.log('Database name:', mongoose.connection.name);
})
.catch((error) => {
  console.error('MongoDB connection error:', {
    message: error.message,
    code: error.code,
    name: error.name,
    stack: error.stack
  });
  process.exit(1); // Eğer veritabanına bağlanamazsak uygulamayı sonlandır
});

// MongoDB bağlantı durumu değişikliklerini dinle
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// Routes
app.use('/api/teams', teamRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/players', playerRoutes);

// Routes will be configured here
// app.use('/api/matches', matchRoutes);

// Debug route to list all registered routes
app.get('/api/debug/routes', (req, res) => {
  const routes: string[] = [];
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      routes.push(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) {
          const path = handler.route.path;
          const methods = Object.keys(handler.route.methods);
          routes.push(`${methods} ${middleware.regexp.toString()} ${path}`);
        }
      });
    }
  });
  res.json({ routes });
});

// MongoDB connection test endpoint
app.get('/api/debug/db', async (req, res) => {
  try {
    const state = mongoose.connection.readyState;
    const dbName = mongoose.connection.name;
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    res.json({
      connectionState: state,
      databaseName: dbName,
      collections: collections.map(c => c.name),
      models: Object.keys(mongoose.models)
    });
  } catch (error) {
    res.status(500).json({
      error: 'Database connection error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Football Tournament API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 