from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import base64
def aes_encrypt(plaintext, key):
    """
    دالة لتشفير النص باستخدام خوارزمية AES.

    :param key: مفتاح التشفير (يجب أن يكون 16، 24، أو 32 بايت).
    :param plaintext: النص الواضح الذي سيتم تشفيره.
    :return: النص المشفر المشفر بـ base64.
    """

    if len(key) not in [16, 24, 32]:
        raise ValueError("طول المفتاح يجب أن يكون 16، 24، أو 32 بايت")

    cipher = AES.new(key.encode("utf-8"), AES.MODE_ECB)

    padded_text = pad(plaintext.encode("utf-8"), AES.block_size)

    encrypted_text = cipher.encrypt(padded_text)

    return base64.b64encode(encrypted_text).decode("utf-8")


def aes_decrypt(ciphertext, key):
    """
    دالة لفك تشفير النص المشفر باستخدام AES.

    :param key: مفتاح التشفير (يجب أن يكون نفس المفتاح المستخدم في التشفير).
    :param ciphertext: النص المشفر المشفر بـ base64.
    :return: النص الواضح الأصلي.
    """

    if len(key) not in [16, 24, 32]:
        raise ValueError("طول المفتاح يجب أن يكون 16، 24، أو 32 بايت")

    cipher = AES.new(key.encode("utf-8"), AES.MODE_ECB)

    encrypted_bytes = base64.b64decode(ciphertext)

    decrypted_padded_text = cipher.decrypt(encrypted_bytes)

    return unpad(decrypted_padded_text, AES.block_size).decode("utf-8")


# أمثلة على الاستخدام
key = "1234567890123456"  # يجب أن يكون 16، 24، أو 32 بايت
plaintext = "mohammed"
encrypted_text = aes_encrypt(plaintext, key)
print("encrypted_text", encrypted_text)
decrypted_text = aes_decrypt(encrypted_text, key)
print("decrypted_text", decrypted_text)
