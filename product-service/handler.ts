import "source-map-support/register";

import { getProductsList } from "./handlers/get-products-list";
import { getProduct } from "./handlers/get-product";
import { postProduct } from './handlers/post-product';

export { getProduct, getProductsList, postProduct };