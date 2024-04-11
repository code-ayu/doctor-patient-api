import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'typeorm.config';
import { PatientModule } from './patient/patient.module';
import { DoctorModule } from './doctor/doctor.module';
import { AppointmentModule } from './appointment/appointment.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    PatientModule,
    DoctorModule,
    AppointmentModule,
  ],

  
})
export class AppModule {}
