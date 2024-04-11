
import { IsNotEmpty} from "class-validator"

export class CreatePatientDto {
    name: string;
    @IsNotEmpty()
    dob: Date;
    @IsNotEmpty()
    contactDetails: string;
}
