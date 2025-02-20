import mongoose, {Document, Schema} from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    isVerified: boolean;
    role: string;
    avatar: {
        public_id: string;
        url: string;
    };
    comparePasswords: (password: string) => Promise<boolean>;
  signAccessToken: () => string,
  signRefreshToken: () => string,
}
// user schema
export const userSchema = new mongoose.Schema<IUser>({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false,
      },
  
      role: {
        type: String,
        default: "user",
      },
  
      avatar: {
        public_id: String,
        url: String,
      },
},{timestamps: true});


//bcrypt hash password
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
      return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

  
  //compare passwords
  userSchema.methods.comparePasswords = async function(password: string) {
      return await bcrypt.compare(password, this.password);
  }

  //sign access token
userSchema.methods.signAccessToken = function(): string {
  return jwt.sign({id: this.id}, process.env.ACCESS_TOKEN as string, {expiresIn: "5m"})
}
//sign refresh token
userSchema.methods.signRefreshToken = function(): string {
  return jwt.sign({id: this.id}, process.env.REFRESH_TOKEN as string, {expiresIn: "7d"});
}


// user model
export const userModel = mongoose.model('User', userSchema);