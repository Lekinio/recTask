import { IsString } from "class-validator";

export class CreateFarmDto {
    @IsString()
    public name: string;

    @IsString()
    public address: string;

    public size: number;

    public yield: number;
}