import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {
      const newProduct = this.productRepository.create(createProductDto);
      return await this.productRepository.save(newProduct);
    } catch (error) {
      throw new InternalServerErrorException("Error al crear el producto.");
    }
  }

  async findAll(options: {
    page: number;
    limit: number;
    search?: string;
    sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
  }) {
    const { page, limit, search, sort } = options;
    const skip = (page - 1) * limit;

    const query = this.productRepository.createQueryBuilder('product');

    if (search) {
      query.where('product.name ILIKE :search', { search: `%${search}%` });
    }

    switch (sort) {
      case 'price_asc':
        query.orderBy('CAST(product.price AS DECIMAL)', 'ASC');
        break;
      case 'price_desc':
        query.orderBy('CAST(product.price AS DECIMAL)', 'DESC');
        break;
      case 'name_asc':
        query.orderBy('product.name', 'ASC');
        break;
      case 'name_desc':
        query.orderBy('product.name', 'DESC');
        break;
      default:
        query.orderBy('product.name', 'ASC');
    }

    const [data, total] = await query
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
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
