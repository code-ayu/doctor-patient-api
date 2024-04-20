
import {  IsNotEmpty, IsUUID } from "class-validator";

export class UpdateAppointmentDto  {
    
    @IsUUID()
    patientId : string ;

    @IsUUID()
    doctorId: string;
    
    @IsNotEmpty()
    appointmentDate: string;

    @IsNotEmpty()
    timeSlot : string;

    @IsNotEmpty()
    status: boolean;
}
