import {
  Endpoint,
  EndpointAuthType,
  EndpointMethod,
} from 'node-server-engine';

import {
  createCartValidator,
  updateCartValidator,
  deleteCartValidator
} from './cart.validator';

import {
  createCartHandler,
  getAllCartHandler,
  getCartByIdHandler,
  updateCartHandler,
  deleteCartHandler
} from './cart.handler';

/**
 * Add Product to Cart
 */
export const createCartEndpoint = new Endpoint({
  path: '/cart',
  method: EndpointMethod.POST,
  handler: createCartHandler,
  authType: EndpointAuthType.JWT,
  validator: createCartValidator,
  // middleware: [middleware.checkPermission('CreateCart')]
});

/**
 * Get Logged-in User Cart
 */
export const getAllCartEndpoint = new Endpoint({
  path: '/cart',
  method: EndpointMethod.GET,
  handler: getAllCartHandler,
  authType: EndpointAuthType.JWT,
  validator: {},
  // middleware: [middleware.checkPermission('GetCart')]
});

/**
 * Get Cart Item By Id
 */
export const getCartByIdEndpoint = new Endpoint({
  path: '/cart/:id',
  method: EndpointMethod.GET,
  handler: getCartByIdHandler,
  authType: EndpointAuthType.JWT,
  validator: {},
  // middleware: [middleware.checkPermission('GetCart')]
});

/**
 * Update Cart Item
 */
export const updateCartEndpoint = new Endpoint({
  path: '/cart/:id',
  method: EndpointMethod.PUT,
  handler: updateCartHandler,
  authType: EndpointAuthType.JWT,
  validator: updateCartValidator,
  // middleware: [middleware.checkPermission('UpdateCart')]
});

/**
 * Delete Cart Item
 */
export const deleteCartEndpoint = new Endpoint({
  path: '/cart/:id',
  method: EndpointMethod.DELETE,
  handler: deleteCartHandler,
  authType: EndpointAuthType.JWT,
  validator: deleteCartValidator,
  // middleware: [middleware.checkPermission('DeleteCart')]
});