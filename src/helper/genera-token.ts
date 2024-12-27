import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import TokenError from './error/token-error';
dotenv.config({ path: '.env.local' });

const generaToken = async (user:any) => {
  const tokenKey=process.env.TOKEN_KEY;
  if (!tokenKey) {
    throw new TokenError('MONGO_URI không được định nghĩa trong file .env.local',404);
  }
  return jwt.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin,
    },
    tokenKey,
    { expiresIn: '365d' },
  );
};

export default generaToken;