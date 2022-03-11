import dotenv from 'dotenv';
dotenv.config();

const {
     PORT,
     NODE_ENV,
     POSTGRES_HOST,
     POSTGRES_PORT,
     POSTGRES_DB,
     POSTGRES_DB_TEST,
     POSTGRES_USER,
     POSTGRES_PASSWORD,
     BYCRPT_PASSWORD,
     SLAT_ROUNDS,
     TOKEN_SECRET
} =  process.env;
export default {
    port:PORT,
    host:POSTGRES_HOST,
    dbPort:POSTGRES_PORT,
    database:NODE_ENV === 'dev' ? POSTGRES_DB : POSTGRES_DB_TEST,
    user:POSTGRES_USER,
    password:POSTGRES_PASSWORD,
    pepper:BYCRPT_PASSWORD,
    salt:SLAT_ROUNDS,
    tokenSecret:TOKEN_SECRET
}