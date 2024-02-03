
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import _crypto from 'crypto';
import { getPassword } from './sanity';

const algorithm = 'aes-256-gcm';
const IV_LENGTH = 16;

function encrypt(text) {
  const _psk = import.meta.env.ENCRYPTION_KEY;

  // random initialization vector
  const iv = _crypto.randomBytes(IV_LENGTH);

  // random salt
  const salt = _crypto.randomBytes(64);

  // derive encryption key: 32 byte key length
  // in assumption the masterkey is a cryptographic and NOT a password there is no need for
  // a large number of iterations. It may can replaced by HKDF
  // the value of 2145 is randomly chosen!
  const key = _crypto.pbkdf2Sync(_psk, salt, 2145, 32, 'sha512');

  // AES 256 GCM Mode
  const cipher = _crypto.createCipheriv(algorithm, key, iv);

  // encrypt the given text
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

  // extract the auth tag
  const tag = cipher.getAuthTag();

  // generate output
  return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
}

function decrypt(encdata){
  const _psk = import.meta.env.ENCRYPTION_KEY;

  // base64 decoding
  const bData = Buffer.from(encdata, 'base64');

  // convert data to buffers
  const salt = bData.slice(0, 64);
  const iv = bData.slice(64, 80);
  const tag = bData.slice(80, 96);
  const text = bData.slice(96);

  // derive key using; 32 byte key length
  const key = _crypto.pbkdf2Sync(_psk, salt , 2145, 32, 'sha512');

  // AES 256 GCM Mode
  const decipher = _crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(tag);

  // encrypt the given text
  const decrypted = decipher.update(text, 'binary', 'utf8') + decipher.final('utf8');

  return decrypted;
}

export const createSession = (password, ipAddress) => {
  const _psk = import.meta.env.JWT_SECRET;

  // Create a unique session ID
  const sessionId = uuidv4();

  // Encrypt the password and IP address
  const encryptedPassword = encrypt(password);
  const encryptedIpAddress = encrypt(ipAddress);

  const token = jwt.sign({ sessionId, _s: encryptedPassword, ssid: encryptedIpAddress }, _psk, { expiresIn: '1d' });

  return token;
}

export const authenticateUser = async (event) => {
  const password = await getPassword();
  const _psk = import.meta.env.JWT_SECRET;
  if (!password) {
    return true;
  }

	// get the cookies from the request
	const { cookies, getClientAddress } = event

	// get the session JWT token from the cookie
	const ssid = cookies.get("_ssid_token");
  if (!ssid) return false;

  const ipAddr = getClientAddress();

  // Verify the JWT
  try {
    const decoded = jwt.verify(ssid, _psk);
    // Check if the decrypted password matches the current password
    if (password !== decrypt(decoded._s)) {
      return false;
    }

    if (ipAddr !== decrypt(decoded.ssid)) {
      return false;
    }

  } catch (err) {
    // If anything fails, return false
    return false;
  }

	return true
}