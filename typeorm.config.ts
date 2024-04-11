import { TypeOrmModuleOptions } from "@nestjs/typeorm";

const config: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'doctor-patient-db',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    logging:true,
    synchronize: true ,
  };
  
  export default config;