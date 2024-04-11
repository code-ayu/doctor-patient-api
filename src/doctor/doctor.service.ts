import { Injectable, NotFoundException } from '@nestjs/common';
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
    // eslint-disable-next-line prefer-const
    let doctor : Doctor = new Doctor();
    doctor.dob = createDoctorDto.dob;
    doctor.name = createDoctorDto.name;
    doctor.availability = createDoctorDto.availability;
    doctor.contactDetails = createDoctorDto.contactDetails;
    doctor.department = createDoctorDto.department
    // finding doctor already in db
    const doctor1 = await this.findDoctorsByContactDetails(doctor.contactDetails)
    if(doctor1.length > 0){
      return {message : "Doctor contact details already exist"}
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
  async findDoctorByIdAndAvailability(doctorId: string, availability: Date): Promise<Doctor> {
    try {
      const doctor = await this.doctorRepo.findOne({ 
        where: { id: doctorId, availability: availability } 
      });

      if (!doctor) {
        throw new NotFoundException('Doctor not found');
      }

      return doctor;
    } catch (error) {
      throw new NotFoundException('Doctor not found');
    }
  }
}
