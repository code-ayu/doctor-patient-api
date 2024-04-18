import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type : 'uuid'})
  patientId: string;

  @Column({type : 'uuid'})
  doctorId: string;

  @Column({nullable : false , default : "" })
  appointmentDate:string ;

  @Column({default : ""})
  timeSlot : string;

  @Column({default: true})
  status : boolean;
}

