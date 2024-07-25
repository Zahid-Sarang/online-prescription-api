import bcryptjs from "bcryptjs";

export class CredentialService {
    async comparePassword(userPassword: string, hashedPassword: string) {
        return await bcryptjs.compare(userPassword, hashedPassword);
    }
}
