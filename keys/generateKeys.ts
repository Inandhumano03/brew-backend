import { generateKeyPair, exportJWK, exportPKCS8 } from 'jose';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';

async function generateKeys() {
  try {
    const keysDir = path.join(process.cwd(), 'keys');

    if (!existsSync(keysDir)) {
      mkdirSync(keysDir);
    }

    const { publicKey, privateKey } = await generateKeyPair('RS256', {
      modulusLength: 2048,
      extractable: true
    });

    // Export Public Key as JWK
    const jwk = await exportJWK(publicKey);

    jwk.use = 'sig';
    jwk.alg = 'RS256';
    jwk.kid = 'gwc-key';

    writeFileSync(
      path.join(keysDir, 'jwks.json'),
      JSON.stringify({ keys: [jwk] }, null, 2)
    );

    // Export Private Key as PEM
    const privateKeyPem = await exportPKCS8(privateKey);

    writeFileSync(
      path.join(keysDir, 'private-key.pem'),
      privateKeyPem
    );

    console.log('✅ RSA Key Pair generated successfully!');
    console.log(`📁 Private Key: ${path.join(keysDir, 'private-key.pem')}`);
    console.log(`📁 JWKS: ${path.join(keysDir, 'jwks.json')}`);
  } catch (error) {
    console.error('Error generating keys:', error);
  }
}

generateKeys();