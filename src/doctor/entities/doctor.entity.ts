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

    @Column({ type: 'date' ,nullable : false })
    availability : Date;

    @Column({default : 'unknown'})
    department: string;
  }

