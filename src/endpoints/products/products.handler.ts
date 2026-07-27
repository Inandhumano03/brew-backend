import {
  EndpointAuthType,
  EndpointRequestType,
  EndpointHandler,
  reportError
} from 'node-server-engine';
import { Response } from 'express';
import { Product, Audit } from 'db';

import {
  PRODUCT_NOT_FOUND,
  PRODUCT_CREATION_ERROR,
  PRODUCT_GET_ERROR,
  PRODUCT_UPDATE_ERROR,
  PRODUCT_DELETION_ERROR
} from './products.const';

/**
 * Create Product
 */
export const createProductHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  req: EndpointRequestType[EndpointAuthType.JWT],
  res: Response
): Promise<void> => {
  const {
    productName,
    description,
    price,
    discount,
    category,
    image
  } = req.body;

  const { user } = req;

  try {
    const newProduct = await Product.create({
      productName,
      description,
      price,
      discount,
      category,
      image,
      createdBy: user.id,
      updatedBy: user.id
    });

    await Audit.create({
      entityType: 'Product',
      entityId: newProduct.id,
      action: 'CREATE',
      newData: newProduct,
    });

    res.status(200).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    reportError(error);

    res.status(500).json({
      message: PRODUCT_CREATION_ERROR,
      error
    });
  }
};

/**
 * Get All Products
 */
export const getAllProductsHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  _req: EndpointRequestType[EndpointAuthType.JWT],
  res: Response
): Promise<void> => {
  try {
    const products = await Product.findAll();

    if (!products || products.length === 0) {
      res.status(404).json({
        message: PRODUCT_NOT_FOUND
      });
      return;
    }

    res.status(200).json({
      products
    });
  } catch (error) {
    reportError(error);

    res.status(500).json({
      message: PRODUCT_GET_ERROR,
      error
    });
  }
};

/**
 * Get Product By Id
 */
export const getProductByIdHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  req: EndpointRequestType[EndpointAuthType.JWT],
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const product = await Product.findOne({
      where: {
        id
      }
    });

    if (!product) {
      res.status(404).json({
        message: PRODUCT_NOT_FOUND
      });
      return;
    }

    res.status(200).json({
      product
    });
  } catch (error) {
    reportError(error);

    res.status(500).json({
      message: PRODUCT_GET_ERROR,
      error
    });
  }
};

/**
 * Update Product
 */
export const updateProductHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  req: EndpointRequestType[EndpointAuthType.JWT],
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { user } = req;

  const {
    productName,
    description,
    price,
    discount,
    category,
    image
  } = req.body;

  try {
    const updateProduct = await Product.findByPk(id);

    if (!updateProduct) {
      res.status(404).json({
        message: PRODUCT_NOT_FOUND
      });
      return;
    }

    const previousData = {
      productName: updateProduct.productName,
      description: updateProduct.description,
      price: updateProduct.price,
      discount: updateProduct.discount,
      category: updateProduct.category,
      image: updateProduct.image
    };

    updateProduct.set({
      productName,
      description,
      price,
      discount,
      category,
      image,
      updatedBy: user?.id
    });

    await updateProduct.save();

    await Audit.create({
      entityType: 'Product',
      entityId: updateProduct.id,
      action: 'UPDATE',
      oldData: previousData,
      newData: updateProduct,
      performedBy: user.id
    });

    res.status(200).json({
      message: 'Product updated successfully',
      product: updateProduct
    });

  } catch (error) {
    reportError(error);

    res.status(500).json({
      message: PRODUCT_UPDATE_ERROR,
      error
    });
  }
};

/**
 * Delete Product
 */
export const deleteProductHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  req: EndpointRequestType[EndpointAuthType.JWT],
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { user } = req;

  try {
    const deleteProduct = await Product.findByPk(id);

    if (!deleteProduct) {
      res.status(404).json({
        message: PRODUCT_NOT_FOUND
      });
      return;
    }

    await Audit.create({
      entityType: 'Product',
      entityId: deleteProduct.id,
      action: 'DELETE',
      oldData: deleteProduct,
      performedBy: user?.id
    });

    await deleteProduct.destroy();

    res.status(200).json({
      message: 'Product deleted successfully'
    });

  } catch (error) {
    reportError(error);

    res.status(500).json({
      message: PRODUCT_DELETION_ERROR,
      error
    });
  }
};