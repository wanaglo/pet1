import mongoose from 'mongoose';

export interface userForDtoModel {
    _id: mongoose.Types.ObjectId;
    email: string;
    isActivated: boolean;
}
