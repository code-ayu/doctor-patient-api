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
    availability: { [date: string]: string[] };
    
    @IsNotEmpty()
    department:string;
}
