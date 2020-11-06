export interface IQueryBuilder {
  getCreateTableStocksQuery: () => string;
  getCreateTableProductsQuery: () => string;
  getCreateProductQuery: () => string;
  getCreateStockQuery: () => string;
  getProductsListQuery: () => string;
  getProductQuery: () => string;
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

  getCreateProductQuery = () => `
    insert into products (title, description, price, image) 
    values ($1, $2, $3, $4)
    RETURNING *
  `;

  getCreateStockQuery = () => `
    insert into stocks (product_id, count) 
    values ($1, $2)
    RETURNING *
  `;

  getProductsListQuery = () => `
    SELECT * FROM products P
    INNER JOIN stocks S
    ON P.id = S.product_id
  `;

  getProductQuery = () => `
    SELECT *
    FROM products P
    INNER JOIN stocks S
    ON P.id = S.product_id AND p.id = $1
  `;
}
