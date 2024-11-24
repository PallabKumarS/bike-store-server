import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

async function main() {
  try {
    const connectDB = async () => {
      console.log('COnnecting to database...');
      await mongoose.connect(config.database_url as string);
      console.log('Connected to database');
    };

    connectDB();

    app.listen(config.port, () => {
      console.log(`Server is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();
