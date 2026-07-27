import {
  Endpoint,
  EndpointAuthType,
  EndpointMethod,

} from 'node-server-engine';

import {
  createProductValidator,
  updateProductValidator,
  deleteProductValidator
} from './products.validator';

import {
  createProductHandler,
  getAllProductsHandler,
  getProductByIdHandler,
  updateProductHandler,
  deleteProductHandler
} from './products.handler';

/**
 * Create Product
 */
export const createProductEndpoint = new Endpoint({
  path: '/products',
  method: EndpointMethod.POST,
  handler: createProductHandler,
  authType: EndpointAuthType.JWT,
  validator: createProductValidator,
//   middleware: [middleware.checkPermission('CreateProduct')]
});

/**
 * Get All Products
 */
export const getAllProductsEndpoint = new Endpoint({
  path: '/products',
  method: EndpointMethod.GET,
  handler: getAllProductsHandler,
  authType: EndpointAuthType.JWT,
  validator: {},
//   middleware: [middleware.checkPermission('GetProduct')]
});

/**
 * Get Product By Id
 */
export const getProductByIdEndpoint = new Endpoint({
  path: '/products/:id',
  method: EndpointMethod.GET,
  handler: getProductByIdHandler,
  authType: EndpointAuthType.JWT,
  validator: {},
//   middleware: [middleware.checkPermission('GetProduct')]
});

/**
 * Update Product
 */
export const updateProductEndpoint = new Endpoint({
  path: '/products/:id',
  method: EndpointMethod.PUT,
  handler: updateProductHandler,
  authType: EndpointAuthType.JWT,
  validator: updateProductValidator,
//   middleware: [middleware.checkPermission('UpdateProduct')]
});

/**
 * Delete Product
 */
export const deleteProductEndpoint = new Endpoint({
  path: '/products/:id',
  method: EndpointMethod.DELETE,
  handler: deleteProductHandler,
  authType: EndpointAuthType.JWT,
  validator: deleteProductValidator,
//   middleware: [middleware.checkPermission('DeleteProduct')]
});