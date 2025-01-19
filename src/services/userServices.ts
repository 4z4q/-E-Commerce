import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
interface RegeisterParms {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginParms {
  email: string;
  password: string;
}

interface UpdateParams {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

interface DeleteParams {
  email: string;
}

export const register = async ({
  firstName,
  lastName,
  email,
  password,
}: RegeisterParms) => {
  const findUser = await userModel.findOne({ email }); // check if user already exists in db

  if (findUser)
    return { data: { message: "User already exists" }, statusCode: 400 };

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await new userModel({
    firstName,
    lastName,
    email,
    password: hashPassword,
  });

  newUser.save();

  return { data: genrateJWT({ firstName, lastName, email }), statusCode: 200 };
};

export const login = async ({ email, password }: LoginParms) => {
  const findUser = await userModel.findOne({ email });

  if (!findUser)
    return { data: { message: "User not found" }, statusCode: 400 };

  const passwordMatch = await bcrypt.compare(password, findUser.password);

  if (passwordMatch)
    return {
      data: genrateJWT({
        email,
        firstName: findUser.firstName,
        lastName: findUser.lastName,
      }),
      statusCode: 200,
    };

  return { data: { message: "User already exists" }, statusCode: 400 };
};

const genrateJWT = (data: any) => {
  return jwt.sign(data, process.env.JWT_SECRET || ""); // Json web Token => Create Key And Encrypt Data
};

export const getAllUsers = async () => {
  const users = await userModel.find();
  return { data: users, statusCode: 200 };
};

export const updateUser = async ({
  firstName,
  lastName,
  email,
}: UpdateParams) => {
  const user = await userModel.findOneAndUpdate({ email }, { new: true });

  if (!user) return { data: { message: "User not found" }, statusCode: 404 };

  // if (password) {
  //   const hashPassword = await bcrypt.hash(password, 10);
  //   user.password = hashPassword;
  // }

  if (firstName && lastName && email) {
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
  }

  user.save();

  return { data: { message: "User updated successfully" }, statusCode: 200 };
};

export const deleteUser = async ({ email }: DeleteParams) => {
  const user = await userModel.findOneAndDelete({ email });
  if (!user) return { data: { message: "User not found" }, statusCode: 404 };
  return { data: { message: "User deleted successfully" }, statusCode: 200 };
};
