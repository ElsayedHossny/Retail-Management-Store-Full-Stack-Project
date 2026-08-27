// src/api/resources.js
// Thin wrappers around the retail-api endpoints (see Q3.Retail-Management-Api/index.js).
import client from "./client";

function unwrapList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function emptyOn404(err) {
  if (err.response?.status === 404) return [];
  throw err;
}

function mapSupplier(row) {
  if (!row) return row;
  return {
    ...row,
    SupplierID: row.SupplierID ?? row.supplierId,
    SupplierName: row.SupplierName ?? row.supplierName,
    ContactNumber: row.ContactNumber ?? row.contactNumber,
  };
}

function mapProduct(row) {
  if (!row) return row;
  return {
    ...row,
    ProductID: row.ProductID ?? row.productId,
    ProductName: row.ProductName ?? row.productName,
    Price: row.Price ?? row.price,
    StockQuantity: row.StockQuantity ?? row.stockQuantity,
    SupplierID: row.SupplierID ?? row.supId ?? row.supplierId,
  };
}

function mapSale(row) {
  if (!row) return row;
  return {
    ...row,
    SaleID: row.SaleID ?? row.salesId ?? row.saleId,
    ProductID: row.ProductID ?? row.proId ?? row.productId,
    ProductName: row.ProductName ?? row.productName,
    QuantitySold: row.QuantitySold ?? row.quantitySold,
    SaleDate: row.SaleDate ?? row.saleDate,
    TotalQuantitySold: row.TotalQuantitySold ?? row.totalQuantitySold,
    Price: row.Price ?? row.price,
    StockQuantity: row.StockQuantity ?? row.stockQuantity,
  };
}

function productBody(data) {
  return {
    productName: data.productName ?? data.ProductName,
    price: data.price ?? data.Price,
    stockQuantity: data.stockQuantity ?? data.StockQuantity,
    supId: data.supId ?? data.SupplierID ?? data.supplierId,
  };
}

function supplierBody(data) {
  return {
    supplierName: data.supplierName ?? data.SupplierName,
    contactNumber: data.contactNumber ?? data.ContactNumber,
  };
}

function saleBody(data) {
  return {
    quantitySold: data.quantitySold ?? data.QuantitySold,
    saleDate: data.saleDate ?? data.SaleDate,
    proId: data.proId ?? data.ProductID ?? data.productId,
  };
}

export const productsApi = {
  list: () =>
    client.get("/products").then((r) => unwrapList(r.data).map(mapProduct)),
  get: (id) =>
    client.get(`/products/${id}`).then((r) => {
      const payload = r.data?.Product ?? r.data?.product ?? r.data;
      const row = Array.isArray(payload) ? payload[0] : payload;
      return mapProduct(row);
    }),
  create: (data) => client.post("/product/add", productBody(data)).then((r) => r.data),
  update: (id, data) =>
    client.patch(`/product/update/${id}`, productBody(data)).then((r) => r.data),
  remove: (id) => client.delete(`/product/delete/${id}`).then((r) => r.data),
};

export const suppliersApi = {
  list: () =>
    client.get("/suppliers").then((r) => unwrapList(r.data).map(mapSupplier)),
  create: (data) => client.post("/supplier/add", supplierBody(data)).then((r) => r.data),
  update: (id, data) =>
    client.patch(`/supplier/update/${id}`, supplierBody(data)).then((r) => r.data),
  remove: (id) => client.delete(`/supplier/delete/${id}`).then((r) => r.data),
};

export const salesApi = {
  list: () => client.get("/sales").then((r) => unwrapList(r.data).map(mapSale)),
  create: (data) => client.post("/sales/add", saleBody(data)).then((r) => r.data),
  byProduct: (productId) =>
    client
      .get(`/sales/product/${productId}`)
      .then((r) => unwrapList(r.data).map(mapSale)),
};

export const reportsApi = {
  totalSoldPerProduct: () =>
    client
      .get("/sales/report/totalQuantity")
      .then((r) => unwrapList(r.data).map(mapSale)),
  highestStockProduct: () =>
    client.get("/product/highest/stockQuantity").then((r) => {
      const rows = unwrapList(r.data).map(mapProduct);
      return rows[0] ?? null;
    }),
  suppliersStartingF: () =>
    client
      .get("/suppliers/namesfilter/F")
      .then((r) => unwrapList(r.data).map(mapSupplier))
      .catch(emptyOn404),
  neverSoldProducts: () =>
    client
      .get("/products/reports/never-sold")
      .then((r) => unwrapList(r.data).map(mapProduct))
      .catch(emptyOn404),
  salesDetails: () =>
    client.get("/Sales/Products").then((r) => unwrapList(r.data).map(mapSale)),
};
