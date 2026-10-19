import mongoose from 'mongoose';
import {
  ROLE_VALUES,
  ACCOUNT_STATUS,
  ACCOUNT_STATUS_VALUES,
} from '../constants/roles.js';

// See docs/model/user.txt. passwordHash is never returned by default.
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ROLE_VALUES,
      required: true,
    },
    accountStatus: {
      type: String,
      enum: ACCOUNT_STATUS_VALUES,
      default: ACCOUNT_STATUS.ACTIVE,
    },
    departmentOrTeam: {
      type: String,
      trim: true,
    },
    profilePhotoUrl: {
      type: String,
      trim: true,
    },
    notificationPreferences: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id.toString(),
    fullName: this.fullName,
    email: this.email,
    phoneNumber: this.phoneNumber,
    role: this.role,
    accountStatus: this.accountStatus,
    departmentOrTeam: this.departmentOrTeam,
    profilePhotoUrl: this.profilePhotoUrl,
    notificationPreferences: this.notificationPreferences,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const User = mongoose.model('User', userSchema);
