import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'src/config';

@Module({
    imports: [
      
        TypeOrmModule.forRoot({
                 type: 'postgres',  
                host: config.database.host,
                port: config.database.port,
                username: config.database.username,
                password: config.database.password,
                database: config.database.name,
                entities: ['dist/apps/blockchain/libs/common/src/entities/*/*.entity.js'],
                logging : "all",    
                synchronize: true
         }),
       
    ],
    providers: [],
})
export class AppModule { }
