from Crypto.Cipher import AES
from base64 import b64decode
import hashlib
from django.conf import settings


def decrypt_password(password: str) -> str:
  try:
    password = password.strip()
    iv_base64, cipher_text_base64 = password.split("::")
    iv = b64decode(iv_base64)
    cipher_text = b64decode(cipher_text_base64)

    if len(iv) != 16:
      raise ValueError("El IV debe tener 16 bytes de longitud.")

    key = hashlib.sha256(settings.SECRET_PASSWORD.encode()).digest()
    
    cipher = AES.new(key, AES.MODE_CBC, iv)

    decrypted_data = cipher.decrypt(cipher_text)

    padding_length = decrypted_data[-1]
    if padding_length < 1 or padding_length > 16:
      raise ValueError("El relleno PKCS7 no es válido")
      
    decrypted_data = decrypted_data[:-padding_length]

    return decrypted_data.decode('utf-8')
  except (ValueError, KeyError, IndexError) as specific_error:
    raise ValueError(f"{str(specific_error)}")
  except Exception as e:
    raise ValueError(f"Error inesperado al desencriptar la contraseña, {str(e)}")

