import Bcrypt from 'bcryptjs';
export class CredentialService {
    async comparePassword(userPassword: string, passwordHash: string) {
        return await Bcrypt.compare(userPassword, passwordHash);
    }
}
