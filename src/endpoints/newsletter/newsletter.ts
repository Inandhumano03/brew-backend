import {
  Endpoint,
  EndpointAuthType,
  EndpointMethod,
} from 'node-server-engine';

import {
  createNewsletterValidator,
  updateNewsletterValidator,
  deleteNewsletterValidator,
  getNewsletterByIdValidator
} from './newsletter.validator';

import {
  createNewsletterHandler,
  getAllNewsletterHandler,
  getNewsletterByIdHandler,
  updateNewsletterHandler,
  deleteNewsletterHandler
} from './newsletter.handler';

/* -------------------------------------------------------------------------- */
/*                        Create Newsletter Subscriber                        */
/* -------------------------------------------------------------------------- */

export const createNewsletterEndpoint = new Endpoint({
  path: '/newsletter',
  method: EndpointMethod.POST,
  handler: createNewsletterHandler,
  authType: EndpointAuthType.NONE,
  validator: createNewsletterValidator,
  // middleware: [middleware.checkPermission('CreateNewsletter')]
});

/* -------------------------------------------------------------------------- */
/*                       Get All Newsletter Subscribers                       */
/* -------------------------------------------------------------------------- */

export const getAllNewsletterEndpoint = new Endpoint({
  path: '/newsletter',
  method: EndpointMethod.GET,
  handler: getAllNewsletterHandler,
  authType: EndpointAuthType.JWT,
  validator: {},
  // middleware: [middleware.checkPermission('GetNewsletter')]
});

/* -------------------------------------------------------------------------- */
/*                     Get Newsletter Subscriber By Id                        */
/* -------------------------------------------------------------------------- */

export const getNewsletterByIdEndpoint = new Endpoint({
  path: '/newsletter/:id',
  method: EndpointMethod.GET,
  handler: getNewsletterByIdHandler,
  authType: EndpointAuthType.JWT,
  validator: getNewsletterByIdValidator,
  // middleware: [middleware.checkPermission('GetNewsletter')]
});

/* -------------------------------------------------------------------------- */
/*                       Update Newsletter Subscriber                         */
/* -------------------------------------------------------------------------- */

export const updateNewsletterEndpoint = new Endpoint({
  path: '/newsletter/:id',
  method: EndpointMethod.PUT,
  handler: updateNewsletterHandler,
  authType: EndpointAuthType.JWT,
  validator: updateNewsletterValidator,
  // middleware: [middleware.checkPermission('UpdateNewsletter')]
});

/* -------------------------------------------------------------------------- */
/*                       Delete Newsletter Subscriber                         */
/* -------------------------------------------------------------------------- */

export const deleteNewsletterEndpoint = new Endpoint({
  path: '/newsletter/:id',
  method: EndpointMethod.DELETE,
  handler: deleteNewsletterHandler,
  authType: EndpointAuthType.JWT,
  validator: deleteNewsletterValidator,
  // middleware: [middleware.checkPermission('DeleteNewsletter')]
});