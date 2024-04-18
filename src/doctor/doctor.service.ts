import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class DoctorService {
  constructor(@InjectRepository(Doctor) private  doctorRepo : Repository<Doctor>){}
  
  //find doctor with contact details 
  async findDoctorsByContactDetails(contactDetails: string): Promise<Doctor[]> {
    const options: FindManyOptions<Doctor> = {
      where: { contactDetails }, // Filter doctors by contact details
    };
    
    const doctors = await this.doctorRepo.find(options);
    if (!doctors || doctors.length === 0) {
      return [];
    }
    return doctors;
  }

  async create(createDoctorDto: CreateDoctorDto) {
    const doctor: Doctor = new Doctor();

    // Check if any past dates are included in availability
    const currentDate = new Date();
    for (const dateStr in createDoctorDto.availability) {
      if (typeof createDoctorDto.availability[dateStr] === 'string') {
        // Skip if the value is not an array of time slots
        continue;
      }
      const date = new Date(dateStr);
      if (date < currentDate) {
        throw new BadRequestException('Cannot add availability for past dates');
      }
    }

    doctor.availability = createDoctorDto.availability;
    doctor.dob = createDoctorDto.dob;
    doctor.name = createDoctorDto.name;
    doctor.contactDetails = createDoctorDto.contactDetails;
    doctor.department = createDoctorDto.department;

    // Finding doctor already in db
    const existingDoctor = await this.findDoctorsByContactDetails(doctor.contactDetails);
    if (existingDoctor.length > 0) {
      throw new BadRequestException('Doctor contact details already exist');
    }

    return this.doctorRepo.save(doctor);
  }


  //get all doctors 
  async findAll() {
    return this.doctorRepo.find();
  }


  //find doctor with id 
  async findOneById(id: string | FindOneOptions<Doctor>) {
    let options: FindOneOptions<Doctor>;
    if (typeof id === 'string') {
      options = { where: { id } };
    } else {
      options = id;
    }

    try {
      const doctor = await this.doctorRepo.findOne(options);
      if (!doctor) {
        throw new NotFoundException('Doctor not found');
      }
      return doctor;
    } catch (error) {
      throw new NotFoundException('Doctor not found');
    }
  }

  //updatee doctor
  async update(id: string, updateDoctorDto: UpdateDoctorDto) {
    try {
      
      const doctor = await this.findOneById(id);
      if (!doctor) {
        throw new NotFoundException('Doctor not found');
      }
      const { contactDetails } = updateDoctorDto;

    // Check if the new contactDetails already exist for another doctor
    const existingDoctor = await this.doctorRepo.findOne({ where: { contactDetails } });
    if (existingDoctor && existingDoctor.id !== id) {
      throw new ConflictException('Contact details already exist for another Doctor');
    }

      doctor.dob = updateDoctorDto.dob;
      doctor.name = updateDoctorDto.name;
      doctor.availability = updateDoctorDto.availability;
      doctor.contactDetails = updateDoctorDto.contactDetails;
      doctor.department = updateDoctorDto.department;
      doctor.id = id;
      const updatedDoctor = await this.doctorRepo.save(doctor);
      return updatedDoctor;
    } catch (error) {
      throw new NotFoundException('Doctor not found');
    }
  }


  //delete doctor
  async remove(id: string) {
    try {
      const doctor = await this.doctorRepo.delete(id);
      if (doctor.affected === 0) {
        throw new NotFoundException('Doctor not found');
      }
      return doctor;
    } catch (error) {
      throw new NotFoundException('Doctor not found');
    }
  }


  //Doctor if and availabiltiy check 
  async findDoctorByIdAndAppointment(doctorId: string, appointmentDate : string , timeSlot : string): Promise<Doctor> {
    try {
      const doctor = await this.doctorRepo.findOne({ 
        where: { id: doctorId } 
      });


      if (!doctor || !doctor.availability) {
        throw new NotFoundException('Doctor not found');
      }

      // Check if the provided date exists in the availability data
      const availableTimeSlots = doctor.availability[appointmentDate];
      if (!availableTimeSlots) 
      {
        throw new NotFoundException('Doctor not available at this Date'); // Date not found
      } 

      // Check if the provided time slot exists for the given date
      const isTimeSlotAvailable = availableTimeSlots.includes(timeSlot);
      if (isTimeSlotAvailable) {
        return doctor;
      }
      else {
        throw new NotFoundException('Doctor not Available at this time');
      }
      } 
    catch (error) {
      throw new NotFoundException('Doctor not found');
    }
  }


  async findDoctorAppointments(doctorId: string, appointmentDate : string){
    try {
      const doctor = await this.doctorRepo.findOne({ 
        where: { id: doctorId } 
      });


      if (!doctor || !doctor.availability) {
        throw new NotFoundException('Doctor not found');
      }

      // Check if the provided date exists in the availability data
      const availableTimeSlots = doctor.availability[appointmentDate];
      if (!availableTimeSlots) 
      {
        throw new NotFoundException('Doctor not available at this Date'); // Date not found
      } 
      return doctor;
      } 
    catch (error) {
      throw new NotFoundException('Doctor not found');
    }
  }
}
