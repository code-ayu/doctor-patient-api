import {  IsNotEmpty, IsUUID } from "class-validator";

export class CreateAppointmentDto {

    @IsUUID()
    patientId : string ;

    @IsUUID()
    doctorId: string;
    
    @IsNotEmpty()
    appointmentDate: string;

    @IsNotEmpty()
    timeSlot : string;


    status: boolean;
}
