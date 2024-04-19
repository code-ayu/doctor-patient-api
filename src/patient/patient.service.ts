import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PatientService {

  //inject patient repo
  constructor(@InjectRepository(Patient) private patientRepo : Repository<Patient> ) {}

    //find doctor with contact details 
    async findPatientByContactDetails(contactDetails: string): Promise<Patient[]> {
      const options: FindManyOptions<Patient> = {
        where: { contactDetails }, // Filter doctors by contact details
      };
      
      const patient = await this.patientRepo.find(options);
      if (!patient || patient.length === 0) {
        return [];
      }
      return patient;
    }
    

  async create(createPatientDto: CreatePatientDto)  {
    // eslint-disable-next-line prefer-const
    let patient : Patient = new Patient();
    patient.name = createPatientDto.name;
    patient.dob = createPatientDto.dob;
    patient.contactDetails = createPatientDto.contactDetails;

    const existingPatient = await this.findPatientByContactDetails(patient.contactDetails);
    if (existingPatient.length > 0) {
      throw new BadRequestException('Patient contact details already exist');
    }
    

    if (patient.dob && new Date(patient.dob) > new Date()) {
      throw new BadRequestException('Date of birth cannot be in the future');
    }
    //console.log(new Date()); 
    //console.log(patient.dob, currentDate, patient.dob > currentDate);
    
    return this.patientRepo.save(patient);
  }

  async findAll() {
    try {
      return this.patientRepo.find();
    }
    catch (error)
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
    const { contactDetails } = updatePatientDto;

    // Check if the new contactDetails already exist for another patient
    const existingPatient = await this.patientRepo.findOne({ where: { contactDetails } });
    if (existingPatient && existingPatient.id !== id) {
      throw new ConflictException('Contact details already exist for another patient');
    }

    // Update patient details
    // eslint-disable-next-line prefer-const
    let patient : Patient = new Patient();
    patient.id = id;
    patient.name = updatePatientDto.name;
    patient.dob = updatePatientDto.dob;
    patient.contactDetails = updatePatientDto.contactDetails;
    // Save the updated patient entity
    return this.patientRepo.save(patient);
  }


  async remove(id: string) {
    try{
      const patient = await this.patientRepo.delete(id);
      if (patient.affected === 0 ){
        throw new NotFoundException('Patient Not Found');
      }
      return {message: "Patient record deleted successfully"};
    }
    catch ( error) {
      throw new NotFoundException('Patient Not Found');

    }
  }
}
