import { ApiProperty } from "@nestjs/swagger";

export class RegistrationDto {
    @ApiProperty()
    login: string;
    
    @ApiProperty()
    password: string;

    @ApiProperty()
    email: string;
}