import {
  EndpointAuthType,
  EndpointRequestType,
  EndpointHandler,
  reportError
} from 'node-server-engine';

import { Response } from 'express';

import {
  Newsletter,
  Audit
} from 'db';

import {
  sendWelcomeEmail
} from '../../services/email.service';

import {
  NEWSLETTER_NOT_FOUND,
  NEWSLETTER_ALREADY_EXISTS,
  NEWSLETTER_CREATION_ERROR,
  NEWSLETTER_GET_ERROR,
  NEWSLETTER_UPDATE_ERROR,
  NEWSLETTER_DELETION_ERROR
} from './newsletter.const';

/* -------------------------------------------------------------------------- */
/*                         Create Newsletter                                  */
/* -------------------------------------------------------------------------- */

export const createNewsletterHandler: EndpointHandler<EndpointAuthType.NONE> = async (
  req: EndpointRequestType[EndpointAuthType.NONE],
  res: Response
): Promise<void> => {

  const { email } = req.body;

  try {

    const existingSubscriber = await Newsletter.findOne({
      where: {
        email
      }
    });

    if (existingSubscriber) {

      res.status(409).json({
        message: NEWSLETTER_ALREADY_EXISTS
      });

      return;

    }

    const subscriber = await Newsletter.create({
      email,
      status: 'ACTIVE'
    });

    await Audit.create({
      entityType: 'Newsletter',
      entityId: subscriber.id,
      action: 'CREATE',
      newData: subscriber
    });

    /* ----------------------- Send Welcome Email ----------------------- */

    if (subscriber.email) {

      await sendWelcomeEmail(
        subscriber.email
      );

    }

    res.status(200).json({
      message: 'Subscribed successfully.',
      subscriber
    });

  } catch (error) {

    reportError(error);

    res.status(500).json({
      message: NEWSLETTER_CREATION_ERROR,
      error
    });

  }

};

/* -------------------------------------------------------------------------- */
/*                        Get All Subscribers                                 */
/* -------------------------------------------------------------------------- */

export const getAllNewsletterHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  _req: EndpointRequestType[EndpointAuthType.JWT],
  res: Response
): Promise<void> => {

  try {

    const subscribers = await Newsletter.findAll({
      order: [
        ['createdAt', 'DESC']
      ]
    });

    if (!subscribers || subscribers.length === 0) {

      res.status(404).json({
        message: NEWSLETTER_NOT_FOUND
      });

      return;

    }

    res.status(200).json({
      subscribers
    });

  } catch (error) {

    reportError(error);

    res.status(500).json({
      message: NEWSLETTER_GET_ERROR,
      error
    });

  }

};

/* -------------------------------------------------------------------------- */
/*                      Get Subscriber By Id                                  */
/* -------------------------------------------------------------------------- */

export const getNewsletterByIdHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  req: EndpointRequestType[EndpointAuthType.JWT],
  res: Response
): Promise<void> => {

  const { id } = req.params;

  try {

    const subscriber = await Newsletter.findByPk(id);

    if (!subscriber) {

      res.status(404).json({
        message: NEWSLETTER_NOT_FOUND
      });

      return;

    }

    res.status(200).json({
      subscriber
    });

  } catch (error) {

    reportError(error);

    res.status(500).json({
      message: NEWSLETTER_GET_ERROR,
      error
    });

  }

};

/* -------------------------------------------------------------------------- */
/*                         Update Subscriber                                  */
/* -------------------------------------------------------------------------- */

export const updateNewsletterHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  req: EndpointRequestType[EndpointAuthType.JWT],
  res: Response
): Promise<void> => {

  const { id } = req.params;

  const { user } = req;

  const {
    email,
    status
  } = req.body;

  try {

    const subscriber = await Newsletter.findByPk(id);

    if (!subscriber) {

      res.status(404).json({
        message: NEWSLETTER_NOT_FOUND
      });

      return;

    }

    if (
      email &&
      email !== subscriber.email
    ) {

      const exists = await Newsletter.findOne({
        where: {
          email
        }
      });

      if (exists) {

        res.status(409).json({
          message: NEWSLETTER_ALREADY_EXISTS
        });

        return;

      }

    }

    const previousData = {
      email: subscriber.email,
      status: subscriber.status
    };

    subscriber.set({
      email,
      status,
      updatedBy: user.id
    });

    await subscriber.save();

    await Audit.create({
      entityType: 'Newsletter',
      entityId: subscriber.id,
      action: 'UPDATE',
      oldData: previousData,
      newData: subscriber,
      performedBy: user.id
    });

    res.status(200).json({
      message: 'Subscriber updated successfully.',
      subscriber
    });

  } catch (error) {

    reportError(error);

    res.status(500).json({
      message: NEWSLETTER_UPDATE_ERROR,
      error
    });

  }

};

/* -------------------------------------------------------------------------- */
/*                        Delete Subscriber                                   */
/* -------------------------------------------------------------------------- */

export const deleteNewsletterHandler: EndpointHandler<EndpointAuthType.JWT> = async (
  req: EndpointRequestType[EndpointAuthType.JWT],
  res: Response
): Promise<void> => {

  const { id } = req.params;

  const { user } = req;

  try {

    const subscriber = await Newsletter.findByPk(id);

    if (!subscriber) {

      res.status(404).json({
        message: NEWSLETTER_NOT_FOUND
      });

      return;

    }

    await Audit.create({
      entityType: 'Newsletter',
      entityId: subscriber.id,
      action: 'DELETE',
      oldData: subscriber,
      performedBy: user.id
    });

    await subscriber.destroy();

    res.status(200).json({
      message: 'Subscriber deleted successfully.'
    });

  } catch (error) {

    reportError(error);

    res.status(500).json({
      message: NEWSLETTER_DELETION_ERROR,
      error
    });

  }

};