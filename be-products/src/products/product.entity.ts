import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'created_at', default: () => 'NOW()' })
  @IsDate()
  createdAt: Date;

  @Column({ name: 'updated_at', nullable: true })
  @IsDate()
  updatedAt?: Date;

  @Column({ name: 'deleted_at', nullable: true })
  @IsDate()
  deletedAt?: Date;

  @Column({ default: true })
  @IsBoolean()
  active: boolean;

  @Column({ length: 255 })
  @Index({ unique: true })
  @IsString()
  @MaxLength(255)
  name: string;

  @Column()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  price: number;

  @Column({ name: 'category_id' })
  @IsString()
  categoryId: string;
}
