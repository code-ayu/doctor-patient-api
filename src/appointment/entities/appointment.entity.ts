import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type : 'uuid'})
  patientId: string;

  @Column({type : 'uuid'})
  doctorId: string;

  @Column({nullable : false  })
  appointmentDate:string ;

  @Column({nullable : false})
  timeSlot : string;

  @Column({nullable :false})
  status : boolean;
}

