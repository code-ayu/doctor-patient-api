import {  IsNotEmpty, IsUUID } from "class-validator";

export class CreateAppointmentDto {

    @IsUUID()
    patientId : string ;

    @IsUUID()
    doctorId: string;
    
    @IsNotEmpty()
    appointmentDate: Date;

    status: boolean;
}
