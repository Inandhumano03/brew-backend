import { Product } from 'db';
import { Schema } from 'express-validator';

export const createProductValidator: Schema = {
  productName: {
    in: 'body',
    exists: {
      errorMessage: 'Product name is required'
    },
    isString: {
      errorMessage: 'Product name must be a string'
    },
    isLength: {
      options: { min: 2, max: 100 },
      errorMessage: 'Product name must be between 2 and 100 characters'
    },
    trim: true,
    custom: {
      options: async (value) => {
        const product = await Product.findOne({
          where: { productName: value },
          raw: true
        });

        if (product) {
          throw new Error('Product name already exists');
        }

        return true;
      }
    }
  },

  description: {
    in: 'body',
    exists: {
      errorMessage: 'Description is required'
    },
    isString: {
      errorMessage: 'Description must be a string'
    },
    isLength: {
      options: { min: 5, max: 1000 },
      errorMessage: 'Description must be between 5 and 1000 characters'
    },
    trim: true
  },

  price: {
    in: 'body',
    exists: {
      errorMessage: 'Price is required'
    },
    isFloat: {
      options: { min: 0 },
      errorMessage: 'Price must be a positive number'
    },
    toFloat: true
  },

  discount: {
    in: 'body',
    optional: true,
    isFloat: {
      options: { min: 0, max: 100 },
      errorMessage: 'Discount must be between 0 and 100'
    },
    toFloat: true
  },

  category: {
    in: 'body',
    exists: {
      errorMessage: 'Category is required'
    },
    isString: {
      errorMessage: 'Category must be a string'
    },
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: 'Category must be between 2 and 50 characters'
    },
    trim: true
  },

  image: {
    in: 'body',
    optional: true,
    isString: {
      errorMessage: 'Image must be a string'
    },
    isLength: {
      options: { max: 500 },
      errorMessage: 'Image URL must be less than 500 characters'
    },
    trim: true
  }
};

export const updateProductValidator: Schema = {
  id: {
    in: 'params',
    exists: {
      errorMessage: 'Product id is required'
    },
    isInt: {
      errorMessage: 'Product id must be an integer'
    },
    toInt: true
  },

  productName: {
    in: 'body',
    exists: {
      errorMessage: 'Product name is required'
    },
    isString: {
      errorMessage: 'Product name must be a string'
    },
    isLength: {
      options: { min: 2, max: 100 },
      errorMessage: 'Product name must be between 2 and 100 characters'
    },
    trim: true
  },

  description: {
    in: 'body',
    exists: {
      errorMessage: 'Description is required'
    },
    isString: {
      errorMessage: 'Description must be a string'
    },
    isLength: {
      options: { min: 5, max: 1000 },
      errorMessage: 'Description must be between 5 and 1000 characters'
    },
    trim: true
  },

  price: {
    in: 'body',
    exists: {
      errorMessage: 'Price is required'
    },
    isFloat: {
      options: { min: 0 },
      errorMessage: 'Price must be a positive number'
    },
    toFloat: true
  },

  discount: {
    in: 'body',
    optional: true,
    isFloat: {
      options: { min: 0, max: 100 },
      errorMessage: 'Discount must be between 0 and 100'
    },
    toFloat: true
  },

  category: {
    in: 'body',
    exists: {
      errorMessage: 'Category is required'
    },
    isString: {
      errorMessage: 'Category must be a string'
    },
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: 'Category must be between 2 and 50 characters'
    },
    trim: true
  },

  image: {
    in: 'body',
    optional: true,
    isString: {
      errorMessage: 'Image must be a string'
    },
    isLength: {
      options: { max: 500 },
      errorMessage: 'Image URL must be less than 500 characters'
    },
    trim: true
  }
};

export const deleteProductValidator: Schema = {
  id: {
    in: 'params',
    exists: {
      errorMessage: 'Product id is required'
    },
    isInt: {
      errorMessage: 'Product id must be an integer'
    },
    toInt: true
  }
};