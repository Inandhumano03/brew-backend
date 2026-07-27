import {
  EndpointAuthType,
  EndpointRequestType,
  EndpointHandler,
  reportError
} from 'node-server-engine';

import { Response } from 'express';

import {
  Cart,
  Product,
  Audit,
  User
} from 'db';

import {
  CART_NOT_FOUND,
  CART_CREATION_ERROR,
  CART_GET_ERROR,
  CART_UPDATE_ERROR,
  CART_DELETION_ERROR,
  CART_ALREADY_EXISTS,
  PRODUCT_NOT_FOUND
} from './cart.const';

/**
 * --------------------------------------------------------
 * Create Cart (Add Product to Cart)
 * --------------------------------------------------------
 */
export const createCartHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  req: EndpointRequestType[EndpointAuthType.JWT],
  res: Response
): Promise<void> => {

  const {
    productId,
    quantity
  } = req.body;

  const { user } = req;

  try {

    /**
     * Check Product
     */
    const product = await Product.findByPk(productId);

    if (!product) {
      res.status(404).json({
        message: PRODUCT_NOT_FOUND
      });
      return;
    }

    /**
     * Product already exists in cart
     */
    const existingCart = await Cart.findOne({
      where: {
        userId: user.id,
        productId,
        status: 'ACTIVE'
      }
    });

    if (existingCart) {

      const newQuantity =
        existingCart.quantity + Number(quantity);

      const totalPrice =
        (Number(product.price) - Number(product.discount || 0))
        * newQuantity;

      existingCart.set({
        quantity: newQuantity,
        totalPrice,
        updatedBy: user.id
      });

      await existingCart.save();

      await Audit.create({
        entityType: 'Cart',
        entityId: existingCart.id,
        action: 'UPDATE',
        oldData: {},
        newData: existingCart,
        performedBy: user.id
      });

      res.status(200).json({
        message: CART_ALREADY_EXISTS,
        cart: existingCart
      });

      return;
    }

    /**
     * Calculate Total Price
     */
    const totalPrice =
      (Number(product.price) - Number(product.discount || 0))
      * Number(quantity);

    /**
     * Create Cart
     */
    const newCart = await Cart.create({

      userId: user.id,

      productId,

      quantity,

      totalPrice,

      status: 'ACTIVE',

      createdBy: user.id,

      updatedBy: user.id

    });

    /**
     * Audit Log
     */
    await Audit.create({

      entityType: 'Cart',

      entityId: newCart.id,

      action: 'CREATE',

      newData: newCart,

      performedBy: user.id

    });

    res.status(200).json({

      message: 'Product added to cart successfully',

      cart: newCart

    });

  } catch (error) {

    reportError(error);

    res.status(500).json({

      message: CART_CREATION_ERROR,

      error

    });

  }

};

/**
 * --------------------------------------------------------
 * Get My Cart
 * --------------------------------------------------------
 */
export const getAllCartHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  req: EndpointRequestType[EndpointAuthType.JWT],
  res: Response
): Promise<void> => {

  const { user } = req;

  try {

    const carts = await Cart.findAll({

      where: {
        userId: user.id,
        status: 'ACTIVE'
      },

      include: [
        {
          model: Product,
          as: 'product'
        },
        {
          model: User,
          as: 'user',
          attributes: [
            'id',
            'firstName',
            'lastName',
            'email'
          ]
        }
      ],

      order: [['createdAt', 'DESC']]

    });

    if (!carts || carts.length === 0) {

      res.status(404).json({
        message: CART_NOT_FOUND
      });

      return;
    }

    res.status(200).json({
      carts
    });

  } catch (error) {

    reportError(error);

    res.status(500).json({
      message: CART_GET_ERROR,
      error
    });

  }

};


/**
 * --------------------------------------------------------
 * Get Cart By Id
 * --------------------------------------------------------
 */
export const getCartByIdHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  req: EndpointRequestType[EndpointAuthType.JWT],
  res: Response
): Promise<void> => {

  const { id } = req.params;

  const { user } = req;

  try {

    const cart = await Cart.findOne({

      where: {
        id
      },

      include: [
        {
          model: Product,
          as: 'product'
        },
        {
          model: User,
          as: 'user',
          attributes: [
            'id',
            'firstName',
            'lastName',
            'email'
          ]
        }
      ]

    });

    if (!cart) {

      res.status(404).json({
        message: CART_NOT_FOUND
      });

      return;
    }

    /**
     * Ownership Validation
     * Only the owner can view the cart item.
     */
    if (cart.userId !== user.id) {

      res.status(403).json({
        message: 'You are not authorized to access this cart item.'
      });

      return;
    }

    res.status(200).json({
      cart
    });

  } catch (error) {

    reportError(error);

    res.status(500).json({
      message: CART_GET_ERROR,
      error
    });

  }

};

/**
 * --------------------------------------------------------
 * Update Cart
 * --------------------------------------------------------
 */
export const updateCartHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  req: EndpointRequestType[EndpointAuthType.JWT],
  res: Response
): Promise<void> => {

  const { id } = req.params;

  const { quantity, status } = req.body;

  const { user } = req;

  try {

    const updateCart = await Cart.findByPk(id, {
      include: [
        {
          model: Product,
          as: 'product'
        }
      ]
    });

    if (!updateCart) {
      res.status(404).json({
        message: CART_NOT_FOUND
      });
      return;
    }

    /**
     * Ownership Validation
     */
    if (updateCart.userId !== user.id) {
      res.status(403).json({
        message: 'You are not authorized to update this cart.'
      });
      return;
    }

    const previousData = {
      quantity: updateCart.quantity,
      totalPrice: updateCart.totalPrice,
      status: updateCart.status
    };

    const product = updateCart.product;

    const updatedQuantity =
      quantity ?? updateCart.quantity;

    const updatedTotalPrice =
      (Number(product.price) - Number(product.discount || 0))
      * Number(updatedQuantity);

    updateCart.set({

      quantity: updatedQuantity,

      totalPrice: updatedTotalPrice,

      status: status ?? updateCart.status,

      updatedBy: user.id

    });

    await updateCart.save();

    await Audit.create({

      entityType: 'Cart',

      entityId: updateCart.id,

      action: 'UPDATE',

      oldData: previousData,

      newData: updateCart,

      performedBy: user.id

    });

    res.status(200).json({

      message: 'Cart updated successfully',

      cart: updateCart

    });

  } catch (error) {

    reportError(error);

    res.status(500).json({

      message: CART_UPDATE_ERROR,

      error

    });

  }

};

/**
 * --------------------------------------------------------
 * Delete Cart Item
 * --------------------------------------------------------
 */
export const deleteCartHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  req: EndpointRequestType[EndpointAuthType.JWT],
  res: Response
): Promise<void> => {

  const { id } = req.params;

  const { user } = req;

  try {

    const deleteCart = await Cart.findByPk(id);

    if (!deleteCart) {

      res.status(404).json({
        message: CART_NOT_FOUND
      });

      return;
    }

    /**
     * Ownership Validation
     */
    if (deleteCart.userId !== user.id) {

      res.status(403).json({
        message: 'You are not authorized to delete this cart.'
      });

      return;
    }

    await Audit.create({

      entityType: 'Cart',

      entityId: deleteCart.id,

      action: 'DELETE',

      oldData: deleteCart,

      performedBy: user.id

    });

    await deleteCart.destroy();

    res.status(200).json({

      message: 'Cart item removed successfully'

    });

  } catch (error) {

    reportError(error);

    res.status(500).json({

      message: CART_DELETION_ERROR,

      error

    });

  }

};