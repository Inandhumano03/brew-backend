// import { expect } from 'chai';
// import sinon from 'sinon';
// import { factory } from 'backend-test-tools';
// import {
//   createMockRequest,
//   createMockResponse,
//   createMockModelInstance
// } from 'test/stubs';

// import { Product, Audit } from 'db/models';

// import {
//   createProductHandler,
//   getAllProductsHandler,
//   getProductByIdHandler,
//   updateProductHandler,
//   deleteProductHandler
// } from './products.handler';

// import {
//   PRODUCT_NOT_FOUND,
//   PRODUCT_CREATION_ERROR,
//   PRODUCT_UPDATE_ERROR,
//   PRODUCT_DELETION_ERROR,
//   PRODUCT_GET_ERROR
// } from './products.const';

// import {
//   createProductValidator,
//   updateProductValidator,
//   deleteProductValidator
// } from './products.validator';

// describe('Products Endpoints', () => {

//   describe('Product Constants', () => {

//     it('should have correct error messages', () => {
//       expect(PRODUCT_NOT_FOUND).to.equal('Product not found');
//       expect(PRODUCT_CREATION_ERROR).to.equal('Error creating product');
//       expect(PRODUCT_UPDATE_ERROR).to.equal('Error updating product');
//       expect(PRODUCT_DELETION_ERROR).to.equal('Error deleting product');
//       expect(PRODUCT_GET_ERROR).to.equal('Error getting products');
//     });

//   });

//   describe('Product Validators', () => {

//     it('should have createProductValidator with required fields', () => {
//       expect(createProductValidator.productName).to.exist;
//       expect(createProductValidator.description).to.exist;
//       expect(createProductValidator.price).to.exist;
//       expect(createProductValidator.discount).to.exist;
//       expect(createProductValidator.category).to.exist;
//     });

//     it('should validate productName with custom validator', () => {
//       expect(createProductValidator.productName.custom).to.exist;
//     });

//     it('should validate price correctly', () => {
//       expect(createProductValidator.price.isFloat).to.exist;
//     });

//     it('should validate discount correctly', () => {
//       expect(createProductValidator.discount.isFloat).to.exist;
//     });

//     it('should have updateProductValidator id param', () => {
//       expect(updateProductValidator.id).to.exist;
//       expect(updateProductValidator.id.in).to.equal('params');
//     });

//     it('should have deleteProductValidator id param', () => {
//       expect(deleteProductValidator.id).to.exist;
//       expect(deleteProductValidator.id.in).to.equal('params');
//       expect(deleteProductValidator.id.isInt).to.exist;
//     });

//   });

//   describe('Product Handlers', () => {

//     let req: any;
//     let res: any;

//     beforeEach(() => {
//       req = createMockRequest();
//       res = createMockResponse();
//     });

//     afterEach(() => {
//       sinon.restore();
//     });

//     describe('POST /products - createProductHandler', () => {

//       it('should create a new product successfully', async () => {

//         const mockProduct = factory.build('product');

//         req.body = {
//           productName: mockProduct.productName,
//           description: mockProduct.description,
//           price: mockProduct.price,
//           discount: mockProduct.discount,
//           category: mockProduct.category
//         };

//         sinon.stub(Product, 'create').resolves({
//           id: 'product-123',
//           ...req.body,
//           createdBy: 'admin-123'
//         } as any);

//         sinon.stub(Audit, 'create').resolves({} as any);

//         await createProductHandler(req, res);

//         expect(res.status).to.have.been.calledWith(200);

//         expect(res.json).to.have.been.calledWith(
//           sinon.match({
//             message: 'Product created successfully'
//           })
//         );

//       });

//       it('should return 500 on creation error', async () => {

//         req.body = {
//           productName: 'Laptop',
//           description: 'Gaming',
//           price: 1000,
//           discount: 10,
//           category: 'Electronics'
//         };

//         const error = new Error('Database error');

//         sinon.stub(Product, 'create').rejects(error);

//         await createProductHandler(req, res);

//         expect(res.status).to.have.been.calledWith(500);

//       });

//     });

//     describe('GET /products', () => {

//       it('should return all products', async () => {

//         const mockProducts = factory.buildMany('product', 2);

//         sinon.stub(Product, 'findAll').resolves(mockProducts as any);

//         await getAllProductsHandler(req, res);

//         expect(res.status).to.have.been.calledWith(200);

//       });

//       it('should return 404 when no products found', async () => {

//         sinon.stub(Product, 'findAll').resolves([] as any);

//         await getAllProductsHandler(req, res);

//         expect(res.status).to.have.been.calledWith(404);

//       });

//       it('should return 500 on error', async () => {

//         const error = new Error('Database error');

//         sinon.stub(Product, 'findAll').rejects(error);

//         await getAllProductsHandler(req, res);

//         expect(res.status).to.have.been.calledWith(500);

//       });

//     });

//         describe('GET /products/:id', () => {

//       it('should return product by id', async () => {

//         const mockProduct = factory.build('product', {
//           id: 'product-123'
//         });

//         req.params.id = 'product-123';

//         sinon.stub(Product, 'findOne').resolves(mockProduct as any);

//         await getProductByIdHandler(req, res);

//         expect(res.status).to.have.been.calledWith(200);

//       });

//       it('should return 404 when product not found', async () => {

//         req.params.id = 'invalid-id';

//         sinon.stub(Product, 'findOne').resolves(null);

//         await getProductByIdHandler(req, res);

//         expect(res.status).to.have.been.calledWith(404);

//       });

//       it('should return 500 on error', async () => {

//         req.params.id = 'product-123';

//         const error = new Error('Database error');

//         sinon.stub(Product, 'findOne').rejects(error);

//         await getProductByIdHandler(req, res);

//         expect(res.status).to.have.been.calledWith(500);

//       });

//     });

//     describe('PUT /products/:id', () => {

//       it('should update product successfully', async () => {

//         req.params.id = 'product-123';

//         const mockProduct = createMockModelInstance(
//           factory.build('product')
//         );

//         sinon.stub(Product, 'findByPk').resolves(mockProduct as any);

//         sinon.stub(Audit, 'create').resolves({} as any);

//         await updateProductHandler(req, res);

//         expect(mockProduct.save).to.have.been.calledOnce;

//         expect(res.status).to.have.been.calledWith(200);

//       });

//       it('should return 404 when product not found', async () => {

//         req.params.id = '123';

//         sinon.stub(Product, 'findByPk').resolves(null);

//         await updateProductHandler(req, res);

//         expect(res.status).to.have.been.calledWith(404);

//       });

//       it('should return 500 on update error', async () => {

//         const error = new Error('Database error');

//         sinon.stub(Product, 'findByPk').rejects(error);

//         await updateProductHandler(req, res);

//         expect(res.status).to.have.been.calledWith(500);

//       });

//     });

//     describe('DELETE /products/:id', () => {

//       it('should delete product successfully', async () => {

//         req.params.id = 'product-123';

//         const mockProduct = createMockModelInstance(
//           factory.build('product')
//         );

//         sinon.stub(Product, 'findByPk').resolves(mockProduct as any);

//         sinon.stub(Audit, 'create').resolves({} as any);

//         await deleteProductHandler(req, res);

//         expect(mockProduct.destroy).to.have.been.calledOnce;

//         expect(res.status).to.have.been.calledWith(200);

//       });

//       it('should return 404 when product not found', async () => {

//         sinon.stub(Product, 'findByPk').resolves(null);

//         await deleteProductHandler(req, res);

//         expect(res.status).to.have.been.calledWith(404);

//       });

//       it('should return 500 on deletion error', async () => {

//         const error = new Error('Database error');

//         sinon.stub(Product, 'findByPk').rejects(error);

//         await deleteProductHandler(req, res);

//         expect(res.status).to.have.been.calledWith(500);

//       });

//     });

//   });

// });