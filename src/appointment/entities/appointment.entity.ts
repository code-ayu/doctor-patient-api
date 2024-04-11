import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type : 'uuid'})
  patientId: string;

  @Column({type : 'uuid'})
  doctorId: string;

  @Column({ type: 'date' ,nullable : false })
  appointmentDate: Date;

  @Column({default: true})
  status : boolean;
}

