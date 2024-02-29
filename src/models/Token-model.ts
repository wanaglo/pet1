import { Schema, model } from 'mongoose';

const tokenSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    refreshToken: { type: String, required: true },
});

export const TokenModel = model('tokens', tokenSchema);
