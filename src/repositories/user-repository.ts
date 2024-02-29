import { UserModel } from '../models/User-model';
import { userCreateModel } from '../interfaces/user-create-model';
import mongoose from 'mongoose';

class UserRepository {
    async findUsers() {
        return await UserModel.find();
    }

    async findUserByEmail(email: string) {
        return await UserModel.findOne({ email });
    }

    async findUserById(id: mongoose.Types.ObjectId) {
        return await UserModel.findById(id);
    }

    async findActivationLink(link: string) {
        return await UserModel.findOne({ activationLink: link });
    }

    async activateUser(id: mongoose.Types.ObjectId) {
        await UserModel.findByIdAndUpdate(id, { isActivated: true });
    }

    async createUser(user: userCreateModel) {
        return await UserModel.create(user);
    }
}

export default new UserRepository();
