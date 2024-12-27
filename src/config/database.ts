import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const connect = async () => {
  try {
    const uri = process.env.MONGODB_URL;
    if (!uri) {
      throw new Error('MONGO_URI không được định nghĩa trong file .env.local');
    }
    await mongoose.connect(uri);
    console.log('Kết nối thành công');
  } catch (err) {
    console.error('Kết nối thất bại', err);
  }
};

export default connect
