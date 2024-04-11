import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id :string;

  @Column({default:'abc'})
  name: string;

  @Column({ type: 'date' })
  dob: Date;

  @Column()
  contactDetails: string;
  
}