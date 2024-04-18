import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Doctor {

    @PrimaryGeneratedColumn('uuid')
    id :string;
  
    @Column({nullable : false})
    name: string;
  
    @Column({ type: 'date' ,nullable : false })
    dob: Date;
  
    @Column({nullable : false})
    contactDetails: string;

    @Column({ type: 'jsonb', nullable: false })
    availability: { [date: string]: string[] };

    @Column()
    department: string;

  }

