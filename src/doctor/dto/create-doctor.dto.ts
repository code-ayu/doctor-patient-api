import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateDoctorDto {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    dob: Date;

    @IsNotEmpty()
    @IsEmail()
    contactDetails: string;

    @IsNotEmpty()
    availability : Date;
    
    @IsNotEmpty()
    department:string;
}
