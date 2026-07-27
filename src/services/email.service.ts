import transporter from "../config/mail";

/* -------------------------------------------------------------------------- */
/*                            Send Welcome Email                              */
/* -------------------------------------------------------------------------- */

export const sendWelcomeEmail = async (
    email: string,
): Promise<void> => {

    await transporter.sendMail({

        from: process.env.MAIL_FROM,

        to: email,

        subject: "☕ Welcome to Brew Haven!",

        html: `
            <div style="
                font-family:Arial,sans-serif;
                max-width:650px;
                margin:auto;
                padding:40px;
                border-radius:12px;
                background:#111827;
                color:#ffffff;
            ">

                <h1 style="color:#F59E0B;">
                    Welcome to Brew Haven!
                </h1>

                <p>
                    Thank you for subscribing to our newsletter.
                </p>

                <p>
                    You'll now receive:
                </p>

                <ul>
                    <li>☕ Coffee launches</li>
                    <li>🍰 Dessert specials</li>
                    <li>🎉 Exclusive offers</li>
                    <li>💸 Discount coupons</li>
                </ul>

                <p>
                    Stay tuned for exciting updates!
                </p>

                <br/>

                <p>
                    — Brew Haven Team
                </p>

            </div>
        `
    });

};

/* -------------------------------------------------------------------------- */
/*                           Send Unsubscribe Email                           */
/* -------------------------------------------------------------------------- */

export const sendUnsubscribeEmail = async (
    email: string,
): Promise<void> => {

    await transporter.sendMail({

        from: process.env.MAIL_FROM,

        to: email,

        subject: "You've Unsubscribed",

        html: `
            <div style="
                font-family:Arial;
                max-width:650px;
                margin:auto;
                padding:40px;
            ">

                <h2>
                    We're sorry to see you go.
                </h2>

                <p>
                    You have successfully unsubscribed
                    from Brew Haven newsletters.
                </p>

                <p>
                    You can subscribe again anytime.
                </p>

            </div>
        `
    });

};

/* -------------------------------------------------------------------------- */
/*                        Send Promotional Newsletter                         */
/* -------------------------------------------------------------------------- */

export const sendNewsletter = async (
    emails: string[],
    subject: string,
    html: string,
): Promise<void> => {

    await transporter.sendMail({

        from: process.env.MAIL_FROM,

        bcc: emails,

        subject,

        html,

    });

};