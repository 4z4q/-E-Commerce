from Crypto.Cipher import DES
from Crypto.Util.Padding import pad, unpad
import base64


def des_encrypt(plaintext, key):
    """
    دالة لتشفير النص باستخدام خوارزمية DES.

    :param key: مفتاح التشفير (يجب أن يكون 8 بايت).
    :param plaintext: النص الواضح الذي سيتم تشفيره.
    :return: النص المشفر المشفر بـ base64.
    """

    if len(key) != 8:
        raise ValueError("key must be 8 bytes long")

    cipher = DES.new(key.encode("utf-8"), DES.MODE_ECB)

    padded_text = pad(plaintext.encode("utf-8"), DES.block_size)

    encrypted_text = cipher.encrypt(padded_text)

    return base64.b64encode(encrypted_text).decode("utf-8")


def des_decrypt(ciphertext, key):
    """
    دالة لفك تشفير النص المشفر باستخدام DES.

    :param key: مفتاح التشفير (يجب أن يكون نفس المفتاح المستخدم في التشفير).
    :param ciphertext: النص المشفر المشفر بـ base64.
    :return: النص الواضح الأصلي.
    """

    if len(key) != 8:
        raise ValueError("key must be 8 bytes long")

    cipher = DES.new(key.encode("utf-8"), DES.MODE_ECB)

    encrypted_bytes = base64.b64decode(ciphertext)

    decrypted_padded_text = cipher.decrypt(encrypted_bytes)

    return unpad(decrypted_padded_text, DES.block_size).decode("utf-8")


key = "mohammed"
plaintext = "skodr"
encrypted_text = des_encrypt(plaintext, key)
print(encrypted_text)
decrypted_text = des_decrypt(encrypted_text, key)
print(decrypted_text)
