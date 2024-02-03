export const sitekey = '6LeRFqAoAAAAAHYzIU-yIYgs7jP_ZMmwcuF_1Naz';

export async function doRecaptcha() {
  return new Promise((resolve, reject) => {
    grecaptcha.ready(async function() {
      grecaptcha.execute(sitekey, { action: "submit" }).then(function(token) {
        resolve(token);
      }, function(error){
        reject(error);
      });
    });
  });
}