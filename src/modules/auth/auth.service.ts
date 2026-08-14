import userModel from "../../database/models/user.model";

class AuthService {
    async getAllUsers() {
        const users = userModel.find();
        return users;
    }
}

export default new AuthService();
