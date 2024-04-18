import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id :string;

  @Column({nullable : false})
  name: string;

  @Column({ type: 'date' })
  dob: Date;

  @Column({nullable : false})
  contactDetails: string;
  
}