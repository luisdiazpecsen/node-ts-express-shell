import { JwtAdapter, bcryptAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";


export class AuthService {
    // DI
    constructor() { }

    public async registerUser(registerUserDto: RegisterUserDto) {
        const userExists = await UserModel.findOne({ email: registerUserDto.email });
        if (userExists) throw CustomError.badRequest('Email already exists');

        try {
            const user = new UserModel(registerUserDto);

            // Encriptar la contraseña
            user.password = bcryptAdapter.hash(registerUserDto.password);

            await user.save();

            // JWT <-- Para mantener la autenticación del usuario

            // Email de confirmación

            const { password, ...userEntity } = UserEntity.fromObject(user);

            return {
                user: userEntity,
                token: 'ABC',
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    public async loginUser(loginUserDto: LoginUserDto) {
        const databaseUser = await UserModel.findOne({ email: loginUserDto.email });
        if (!databaseUser) throw CustomError.notFound('Email does not exist');

        const passwordMatches = bcryptAdapter.compare(loginUserDto.password, databaseUser.password);
        if (!passwordMatches) throw CustomError.badRequest('Incorrect password');

        const { password, ...userEntity } = UserEntity.fromObject(databaseUser);

        const token = await JwtAdapter.generateToken({ id: databaseUser.id });
        if (!token) throw CustomError.internalServer('Error while creating JWT');

        return {
            user: userEntity,
            token,
        };
    }
}