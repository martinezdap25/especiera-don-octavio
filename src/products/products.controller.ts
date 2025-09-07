import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  DefaultValuePipe,
} from "@nestjs/common";
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from "src/auth/auth.guard";

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.productsService.findAll({ page, limit, search });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
