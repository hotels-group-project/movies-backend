import { ApiProperty } from "@nestjs/swagger";


export class AuthResponse {    
    @ApiProperty()
    code: number;

    @ApiProperty()
    message: string;    

    @ApiProperty()
    token: string;  
}