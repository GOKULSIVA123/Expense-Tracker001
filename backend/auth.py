import os
import requests
import json
from flask import request, jsonify
from functools import wraps
import jwt
from jwt.algorithms import RSAAlgorithm
from jwt.exceptions import PyJWTError
from dotenv import load_dotenv

load_dotenv()

# --- Configuration (Set this in your .env file) ---
# NOTE: Replace 'kn0wn-catfish-97' with the actual domain name you derived
CLERK_FRONTEND_API = os.getenv("CLERK_FRONTEND_API", "https://kn0wn-catfish-97.clerk.accounts.dev")
# This URL is where the public keys are stored
CLERK_JWKS_URL = f"{CLERK_FRONTEND_API}/.well-known/jwks.json"

# Global dictionary to cache public keys for efficiency
PUBLIC_KEYS = {} 

def get_public_keys():
    """Fetches the JWKS keys from Clerk and caches them for fast verification."""
    global PUBLIC_KEYS
    if PUBLIC_KEYS:
        return PUBLIC_KEYS # Return cached keys if available
        
    try:
        response = requests.get(CLERK_JWKS_URL)
        response.raise_for_status() # Check for HTTP errors
        jwks = response.json()
        
        for key in jwks['keys']:
            # Convert the JWK data into a PyJWT-usable public key object
            PUBLIC_KEYS[key['kid']] = RSAAlgorithm.from_jwk(json.dumps(key))
            
    except requests.exceptions.RequestException as e:
        print(f"ERROR: Could not fetch Clerk JWKS keys: {e}")
        return None
    except Exception as e:
        print(f"ERROR: Invalid JWKS structure or processing error: {e}")
        return None
    return PUBLIC_KEYS


# --- THE DECORATOR: Used on routes that require a logged-in user ---
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # 1. Look for the 'Authorization' header (Bearer Token)
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'message': 'Authorization token is missing or invalid!'}), 401
        
        token = auth_header.split(' ')[1]
        
        try:
            # 2. Retrieve keys and token information
            keys = get_public_keys()
            if not keys:
                 return jsonify({'message': 'Could not fetch public keys for verification.'}), 500

            # Extract the Key ID (kid) to find the correct public key
            unverified_header = jwt.get_unverified_header(token)
            kid = unverified_header.get('kid')
            
            public_key = keys.get(kid)
            if public_key is None:
                return jsonify({'message': 'Invalid token: Signing key not found.'}), 401
            
            # 3. Decode and verify the token signature (using RS256)
            # PyJWT automatically validates 'exp', 'nbf', and 'iat' claims
            payload = jwt.decode(
                token,
                public_key.to_pem().decode('utf-8'),
                algorithms=['RS256'] # Clerk tokens are signed with RS256
            )
            
            # 4. Attach the user ID ('sub' claim) to the request object
            # The 'sub' claim holds the unique user ID (user_...)
            request.user_id = payload.get('sub') 
            
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired. Please log in again.'}), 401
        except PyJWTError:
            return jsonify({'message': 'Token verification failed.'}), 401
        except Exception:
            return jsonify({'message': 'Internal verification error.'}), 500
        
        return f(*args, **kwargs)
    return decorated