export interface IQueryBuilder {
  getCreateTableStocksQuery: () => string;
  getCreateTableProductsQuery: () => string;
  getCreateProductQuery: (
    title: string,
    description: string,
    price: number,
    image: string
  ) => string;
  getCreateStockQuery: (product_id: string, count: number) => string;
  getProductsListQuery: () => string;
  getProductQuery: (id: string) => string;
}

export class QueryBuilder implements IQueryBuilder {
  getCreateTableStocksQuery = () => `
    create table products(
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      title text NOT NULL,
      description text,
      image text,
      price integer
    )
  `;

  getCreateTableProductsQuery = () => `
    create table stocks(
      product_id uuid,
      foreign key ("product_id") references "products" ("id"),
      count integer
    )
  `;

  getCreateProductQuery = (
    title: string,
    description: string,
    price: number,
    image: string
  ) => `
    insert into products (title, description, price, image) 
    values ('${title}', '${description}', '${price}', '${image}')
    RETURNING *
  `;

  getCreateStockQuery = (product_id: string, count: number) => `
    insert into stocks (product_id, count) 
    values ('${product_id}', '${count}')
    RETURNING *
  `;

  getProductsListQuery = () => `
    SELECT * FROM products P
    INNER JOIN stocks S
    ON P.id = S.product_id
  `;

  getProductQuery = (id: string) => `
    SELECT *
    FROM products P
    INNER JOIN stocks S
    ON P.id = S.product_id AND p.id = '${id}'
  `;
}
