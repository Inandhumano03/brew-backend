import { Cart, Product } from 'db';
import { Schema } from 'express-validator';

/**
 * Create Cart Validator
 */
export const createCartValidator: Schema = {

  productId: {
    in: 'body',
    exists: {
      errorMessage: 'Product id is required'
    },
    isInt: {
      errorMessage: 'Product id must be an integer'
    },
    toInt: true,
    custom: {
      options: async (value) => {

        const product = await Product.findByPk(value);

        if (!product) {
          throw new Error('Product not found');
        }

        return true;
      }
    }
  },

  quantity: {
    in: 'body',
    exists: {
      errorMessage: 'Quantity is required'
    },
    isInt: {
      options: {
        min: 1
      },
      errorMessage: 'Quantity must be greater than zero'
    },
    toInt: true
  }

};


/**
 * Update Cart Validator
 */
export const updateCartValidator: Schema = {

  id: {
    in: 'params',
    exists: {
      errorMessage: 'Cart id is required'
    },
    isInt: {
      errorMessage: 'Cart id must be an integer'
    },
    toInt: true
  },

  quantity: {
    in: 'body',
    optional: true,
    isInt: {
      options: {
        min: 1
      },
      errorMessage: 'Quantity must be greater than zero'
    },
    toInt: true
  },

  status: {
    in: 'body',
    optional: true,
    isIn: {
      options: [['ACTIVE', 'ORDERED', 'REMOVED']],
      errorMessage: 'Invalid cart status'
    }
  }

};


/**
 * Delete Cart Validator
 */
export const deleteCartValidator: Schema = {

  id: {
    in: 'params',
    exists: {
      errorMessage: 'Cart id is required'
    },
    isInt: {
      errorMessage: 'Cart id must be an integer'
    },
    toInt: true
  }

};