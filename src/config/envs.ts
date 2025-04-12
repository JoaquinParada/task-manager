import 'dotenv/config';
import * as joi from "joi";

interface EnvVars {
    PORT: number,
    DB_KEY: string,
    HOST_DB: string,
    PORT_DB: number
    USERNAME_DB: string
    DB: string,
    SECRET_KEY_JWT: string,
    REFRESH_TOKEN_SECRET: string,
    API_KEY: string
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    DB_KEY: joi.string().required(),
    HOST_DB: joi.string().required(),
    PORT_DB: joi.number().required(),
    USERNAME_DB: joi.string().required(),
    DB: joi.string().required(),
    SECRET_KEY_JWT: joi.string().required(),
    REFRESH_TOKEN_SECRET: joi.string().required(),
    API_KEY: joi.string().required()
}).unknown(true);

const { error, value } = envsSchema.validate(process.env);

const envVars: EnvVars = value;
if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}


export const envs = {
    port: envVars.PORT,
    dbKey: envVars.DB_KEY,
    hostDb: envVars.HOST_DB,
    portDb: envVars.PORT_DB,
    usernameDb: envVars.USERNAME_DB,
    db: envVars.DB,
    secretKeyJwt: envVars.SECRET_KEY_JWT,
    refreshTokenSecret: envVars.REFRESH_TOKEN_SECRET,
    apiKey: envVars.API_KEY
}