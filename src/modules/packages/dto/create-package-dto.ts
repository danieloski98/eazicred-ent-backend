import { ApiProperty } from "@nestjs/swagger";
import { Duration } from "../schema/schema";
import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePackageDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        type: Number,
    })
    @IsNotEmpty()
    @IsNumber()
    totalPrice: number;

    @ApiProperty({
        type: Number,
    })
    @IsNotEmpty()
    @IsNumber()
    initialDeposit: number;

    @ApiProperty({
        type: Duration,
        isArray: true,
    })
    @IsNotEmpty()
    @IsArray()
    duration: Duration[]
}