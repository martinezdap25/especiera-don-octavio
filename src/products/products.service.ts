import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const newProduct = this.productRepository.create(createProductDto);
      return await this.productRepository.save(newProduct);
    } catch (error) {
      throw new InternalServerErrorException("Error al crear el producto.");
    }
  }

  async findAll() {
    return this.productRepository.find();
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Producto con ID "${id}" no encontrado.`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID "${id}" no encontrado para actualizar.`);
    }

    try {
      return await this.productRepository.save(product);
    } catch (error) {
      throw new InternalServerErrorException("Error al actualizar el producto.");
    }
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    const result = await this.productRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Producto con ID "${id}" no encontrado para eliminar.`);
    }
    return { message: `Producto con ID "${id}" eliminado correctamente.` };
  }
}
