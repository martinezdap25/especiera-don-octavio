import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UnitType {
  GRAMS = "grams",
  UNIT = "unit",
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "enum", enum: UnitType })
  unitType: UnitType;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @DeleteDateColumn()
  deletedAt: Date;
}
