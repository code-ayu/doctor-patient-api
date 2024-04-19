import {  ConflictException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
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
    const doctor = await this.doctorService.findDoctorByIdAndAppointment(createAppointmentDto.doctorId , createAppointmentDto.appointmentDate , createAppointmentDto.timeSlot);
    //console.log(doctor)
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const existingAppointment = await this.appointmentRepo.findOne({
      where: {
        patientId: createAppointmentDto.patientId,
        doctorId: createAppointmentDto.doctorId,
        appointmentDate: createAppointmentDto.appointmentDate,
        timeSlot: createAppointmentDto.timeSlot,
      },
    });
    if (existingAppointment) {
      throw new ConflictException('Appointment already exists');
    }
    else {
    // Create appointment
    const appointment : Appointment = new Appointment();
    appointment.patientId = createAppointmentDto.patientId;
    appointment.doctorId = createAppointmentDto.doctorId;
    appointment.appointmentDate = createAppointmentDto.appointmentDate;
    appointment.timeSlot = createAppointmentDto.timeSlot;
    return this.appointmentRepo.save(appointment);
    }
  }


  //find all appointments for a doctor on given date
  async getAppointmentsForDoctorOnDate(doctorId: string, date: string) {
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
  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {

    const appointment : Appointment = new Appointment();
    const existingAppointment = await this.appointmentRepo.findOne({
      where: {
        patientId: updateAppointmentDto.patientId,
        doctorId: updateAppointmentDto.doctorId,
        appointmentDate: updateAppointmentDto.appointmentDate,
        timeSlot: updateAppointmentDto.timeSlot,
      },
    });
    appointment.id = id;
    appointment.patientId = updateAppointmentDto.patientId;
    appointment.doctorId = updateAppointmentDto.doctorId;
    appointment.appointmentDate = updateAppointmentDto.appointmentDate;
    appointment.timeSlot = updateAppointmentDto.timeSlot;
    appointment.status = updateAppointmentDto.status; 
    if (!appointment.status) {
      this.appointmentRepo.delete(id);
      return {message : "Appointment canceled succesfully"}
    }

    if (existingAppointment) {
      throw new ConflictException('Appointment already exists');
    }
    
    return this.appointmentRepo.save(appointment);
  }

  async remove(id: string) {
    return this.appointmentRepo.delete(id);
  }

  async getBookedTimeSlots(doctorId: string, date: string){
    const appointments = await this.appointmentRepo.find({
      where: {
        doctorId,
        appointmentDate: date,
      },
      select: ['timeSlot'], // Select only the timeSlot property
    });
  
    // Extract time slots from appointments
    const timeSlots = appointments.map(appointment => appointment.timeSlot);
  
    return timeSlots;
  }


  //API to find available time slots for a doctor,
  async getAvailableTimeSlots(doctorId: string, appointmentDate: string) {
    try {
      // Check if doctor exists
      const doctor = await this.doctorService.findDoctorAppointments(doctorId, appointmentDate); // created an extra method with only appointemnt date and docId
      //console.log(doctor)
  
      if (!doctor || !doctor.availability) {
        throw new NotFoundException('Doctor not found or availability data missing');
      }
  
      // Retrieve doctor's availability for the appointment date
      const availabilityForDate = doctor.availability[appointmentDate];
      //console.log(availabilityForDate)
  
      if (!availabilityForDate) {
        throw new NotFoundException('No availability found for the selected date');
      }
  
      // Retrieve booked time slots for the doctor on the appointment date
      const bookedTimeSlots = await this.getBookedTimeSlots(doctorId , appointmentDate);
  
      // Filter out booked time slots
      const unbookedTimeSlots = availabilityForDate.filter(
        timeSlot => !bookedTimeSlots.includes(timeSlot)
      );

    return {"availableTimeSlots" : unbookedTimeSlots};
    } 
    catch (error) {
      throw new InternalServerErrorException('Error fetching available time slots', error);
    }
  }
  

}
