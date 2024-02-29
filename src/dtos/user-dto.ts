import { userForDtoModel } from '../interfaces/user-for-dto-model';

export class UserDto {
    id: string;
    email: string;
    isActivated: boolean;

    constructor(model: userForDtoModel) {
        this.id = model._id.toString();
        this.email = model.email;
        this.isActivated = model.isActivated;
    }
}
