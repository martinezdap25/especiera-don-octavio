import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
} from "class-validator";
import { UnitType } from '../entities/product.entity';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsEnum(UnitType)
  unitType: UnitType;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable: boolean = true;
}
