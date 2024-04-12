import {  Injectable, NotFoundException} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { PatientService } from '../patient/patient.service';
import { DoctorService } from '../doctor/doctor.service';


@Injectable()
export class AppointmentService {
  
  constructor(
    private patientService: PatientService,
    private  doctorService: DoctorService,
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  //book an appointment with the doctor
  async bookAppointment(createAppointmentDto : CreateAppointmentDto) {
    //Check if patient is there
    const patient = await this.patientService.findOneById(createAppointmentDto.patientId);
    //console.log(patient);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Check if doctor is there 
    const doctor = await this.doctorService.findDoctorByIdAndAvailability(createAppointmentDto.doctorId , createAppointmentDto.appointmentDate);
    //console.log(doctor)
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    // Create appointment
    const appointment : Appointment = new Appointment();
    appointment.patientId = createAppointmentDto.patientId;
    appointment.doctorId = createAppointmentDto.doctorId;
    appointment.appointmentDate = createAppointmentDto.appointmentDate;
    return this.appointmentRepo.save(appointment);
  }

  //find all appointments for a doctor on given date
  async getAppointmentsForDoctorOnDate(doctorId: string, date: Date): Promise<Appointment[]> {
    return this.appointmentRepo.find({
      where: {
        doctorId,
        appointmentDate: date,
      },
    }); 
  }

  findAll() {
    return this.appointmentRepo.find();
  }



  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    const appointment : Appointment = new Appointment();
    appointment.id = id;
    appointment.patientId = updateAppointmentDto.patientId;
    appointment.doctorId = updateAppointmentDto.doctorId;
    appointment.appointmentDate = updateAppointmentDto.appointmentDate;
    appointment.status = updateAppointmentDto.status;

    if (!appointment.status) {
      return this.appointmentRepo.delete(id);
    }

    return this.appointmentRepo.save(appointment);
    
  }

  remove(id: string) {
    return this.appointmentRepo.delete(id);
  }
}
