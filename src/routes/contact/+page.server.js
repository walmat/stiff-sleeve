import { z } from "zod"
import { fail } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms/server';

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  orderNumber: z.string().optional(),
  message: z.string().min(1),
  _t: z.string(),
})

export const load = (async () => {
  const form = await superValidate(contactSchema);

  return { form };
});

export const actions = {
  contact: async ({ request }) => {
    const formData = await request.formData();

    try {
      const form = await superValidate(formData, contactSchema);
      if (!form.valid) {
        return fail(400, { form });
      }

      const { _t, ...data } = form.data;

      // If using reCAPTCHA, validate the token here
      const sk = import.meta.env.VITE_RECAPTCHA_SECRET_KEY;
      if (sk && !_t) {
        return fail(400, {
          subscribe: {
            success: false,
            message: 'Recaptcha token is required',
          }
        })
      }

      if (_t) {
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${sk}&response=${_t}`;
        const response = await fetch(url, {
          method: 'post',
        })

        if (!response.ok) {
          return fail(400, {
            subscribe: {
              success: false,
              message: 'Recaptcha token is invalid',
            }
          })
        }
      }

      const fields = [
        { name: "Name", value: data.name },
        { name: "Email", value: data.email },
      ];

      if (data.orderNumber) {
        fields.push({ name: "Order #", value: data.orderNumber });
      }

      fields.push({ name: "Message", value: data.message });

      try {
        const files = formData.get('files');
        const parsedFiles = JSON.parse(files);
        if (parsedFiles.length) {
          parsedFiles.forEach(file => {
            fields.push({ name: "Attachments", value: `[${file.path}](https://gateway.pinata.cloud/ipfs/${file.ipfsHash})` });
          });
        }
      } catch (err) {
        // noop
      }

      const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;
      if (!webhookUrl) {
        return fail(500, {
          contact: {
            success: false,
            message: 'The contact form is not configured properly.',
          }
        });
      }

      const discordResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          embeds: [{
            title: "Contact Form",
            fields,
            color: 5814783
          }]
        }),
      });

      if (!discordResponse.ok) {
        return fail(500, {
          contact: {
            success: false,
            message: 'There was an error sending your message to Discord.',
          }
        });
      }

      return {
        contact: {
          success: true,
          message: 'Your message has been sent successfully.',
        }
      };
    } catch (err) {
      console.log(err);
      return fail(500, 'An unexpected error occurred.');
    }
  }
};