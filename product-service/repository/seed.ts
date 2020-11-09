import { ProductsRepository } from "./products-repository";
import { productsList } from "./db";
import { CreateProductDTO } from "../DTO/create-product.dto";

(async function () {
  const productsRepository = new ProductsRepository();

  productsList.forEach(async (product) => {
    const createProductDTO = new CreateProductDTO(product);
    const createdProduct = await productsRepository.createProduct(createProductDTO);
    console.log(createdProduct);
  });
})();
