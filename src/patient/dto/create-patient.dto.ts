
import { IsEmail, IsNotEmpty} from "class-validator"

export class CreatePatientDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    dob: Date;

    @IsNotEmpty()
    @IsEmail()
    contactDetails: string;
}
