import { error, json } from '@sveltejs/kit';

const webhook_link = 'https://discord.com/api/webhooks/1203123705924821052/mvQl2FYg0E6cAg_ZQzN4gLlN74LxxLlfz69NEf_5utjqybNRlmfhIYN7lQGM-wmGhybj';

export const actions = {
  contact: async ({ request }) => {
    try {
      const data = await request.formData();
      const name = data.get('name');
      const email = data.get('email');
      const order = data.get('order');
      const message = data.get('message');
      const files = data.get('files');
      const token = data.get('_t');

      // Validate the inputs as necessary
      if (!name || !email || !message) {
        return fail(400, {
          contact: {
            success: false,
            message: 'Please fill in all required fields.',
          }
        });
      }

      // If using reCAPTCHA, validate the token here
      const sk = import.meta.env.VITE_RECAPTCHA_SECRET_KEY;
      if (sk && !token) {
        return fail(400, {
          subscribe: {
            success: false,
            message: 'Recaptcha token is required',
          }
        })
      }

      if (token) {
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${sk}&response=${token}`;
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
        { name: "Name", value: name },
        { name: "Email", value: email },
      ];

      if (order) {
        fields.push({ name: "Order", value: order });
      }

      fields.push({ name: "Message", value: message });

      if (files) {
        const parsedFiles = JSON.parse(files);
        parsedFiles.forEach(file => {
          fields.push({ name: "Attachments", value: `[${file.path}](https://gateway.pinata.cloud/ipfs/${file.ipfsHash})` });
        });
      }

      const discordResponse = await fetch(webhook_link, {
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
      return error(500, 'An unexpected error occurred.');
    }
  }
};