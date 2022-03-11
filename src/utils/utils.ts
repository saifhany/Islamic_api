import config from "../config";
import bcrypt from "bcrypt";


export const hashPassword = (password: string) => {
    const salt = parseInt(config.salt as string, 10)
    return bcrypt.hashSync(`${password}${config.pepper}`, salt)
}

export const comparePassword = (password:string, hashed:any) => {
    return bcrypt.compareSync( `${password}${config.pepper}`, hashed);
  };
  