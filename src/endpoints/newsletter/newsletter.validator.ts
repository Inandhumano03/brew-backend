import { Newsletter } from 'db';
import { Schema } from 'express-validator';

/* -------------------------------------------------------------------------- */
/*                        Create Newsletter Subscriber                         */
/* -------------------------------------------------------------------------- */

export const createNewsletterValidator: Schema = {
    email: {
        in: 'body',
        exists: {
            errorMessage: 'Email is required'
        },
        isEmail: {
            errorMessage: 'Please provide a valid email address'
        },
        normalizeEmail: true,
        custom: {
            options: async (value) => {
                const subscriber = await Newsletter.findOne({
                    where: {
                        email: value
                    },
                    raw: true
                });

                if (subscriber) {
                    throw new Error('Email is already subscribed');
                }

                return true;
            }
        }
    }
};

/* -------------------------------------------------------------------------- */
/*                          Update Newsletter                                 */
/* -------------------------------------------------------------------------- */

export const updateNewsletterValidator: Schema = {
    id: {
        in: 'params',
        exists: {
            errorMessage: 'Subscriber id is required'
        },
        isInt: {
            errorMessage: 'Subscriber id must be an integer'
        },
        toInt: true
    },

    email: {
        in: 'body',
        optional: true,
        isEmail: {
            errorMessage: 'Please provide a valid email address'
        },
        normalizeEmail: true,
        custom: {
            options: async (value, { req }) => {

                const id = Number(req.params?.id);

                const subscriber =
                    await Newsletter.findOne({
                        where: {
                            email: value
                        }
                    });

                if (
                    subscriber &&
                    subscriber.id !== id
                ) {
                    throw new Error(
                        "Email is already subscribed"
                    );
                }

                return true;
            }
        }
    },

    status: {
        in: 'body',
        optional: true,
        isIn: {
            options: [['ACTIVE', 'UNSUBSCRIBED']],
            errorMessage:
                'Status must be ACTIVE or UNSUBSCRIBED'
        }
    }
};

/* -------------------------------------------------------------------------- */
/*                       Delete Newsletter Subscriber                         */
/* -------------------------------------------------------------------------- */

export const deleteNewsletterValidator: Schema = {
    id: {
        in: 'params',
        exists: {
            errorMessage: 'Subscriber id is required'
        },
        isInt: {
            errorMessage: 'Subscriber id must be an integer'
        },
        toInt: true
    }
};

/* -------------------------------------------------------------------------- */
/*                     Get Newsletter Subscriber By Id                        */
/* -------------------------------------------------------------------------- */

export const getNewsletterByIdValidator: Schema = {
    id: {
        in: 'params',
        exists: {
            errorMessage: 'Subscriber id is required'
        },
        isInt: {
            errorMessage: 'Subscriber id must be an integer'
        },
        toInt: true
    }
};