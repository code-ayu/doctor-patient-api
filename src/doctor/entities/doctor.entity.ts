import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @Column('jsonb', ) //remove default after forst run 
    bookings: { [timeSlot: string]: number }; // Example: { "9:00 - 10:00": 2, "11:00 - 12:00": 3 } 

    @BeforeInsert()
    initializeBookings() {
      // Initialize bookings for all time slots in the availability
      if (!this.bookings) {
        this.bookings = {};
      }
      for (const date of Object.keys(this.availability)) {
        for (const timeSlot of this.availability[date]) {
          if (!this.bookings[timeSlot]) {
            this.bookings[timeSlot] = 0;
          }
        }
      }
    }
  }

