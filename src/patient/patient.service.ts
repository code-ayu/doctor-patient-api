import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { FindOneOptions, Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PatientService {

  //inject patient repo
  constructor(@InjectRepository(Patient) private patientRepo : Repository<Patient> ) {}


  async create(createPatientDto: CreatePatientDto)  {
    // eslint-disable-next-line prefer-const
    let patient : Patient = new Patient();
    patient.name = createPatientDto.name;
    patient.dob = createPatientDto.dob;
    patient.contactDetails = createPatientDto.contactDetails;
    return this.patientRepo.save(patient);
  }

  async findAll() {
    try {
      return this.patientRepo.find();
    }
    catch
    {
      return [];
    }
  }


  async findOneById(id: string | FindOneOptions<Patient>) {
    let options: FindOneOptions<Patient>;
    if (typeof id === 'string') {
      options = { where: { id } };
    } else {
      options = id;
    }

    try{
      const patient = await this.patientRepo.findOne(options);
      if (!patient) {
        throw new NotFoundException('Patient not found');
      }
      return patient;
    }
    catch (error){
      throw new NotFoundException('Patient not found');
    }
   
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    // eslint-disable-next-line prefer-const
    let patient : Patient = new Patient();
    patient.name = updatePatientDto.name;
    patient.dob = updatePatientDto.dob;
    patient.contactDetails = updatePatientDto.contactDetails;
    patient.id = id;
    return this.patientRepo.save(patient);
  }

  async remove(id: number) {
    try{
      const patient = await this.patientRepo.delete(id);
      if (patient.affected === 0 ){
        throw new NotFoundException('Patient Not Found');
      }
      return patient;
    }
    catch ( error) {
      throw new NotFoundException('Patient Not Found');

    }
  }
}
