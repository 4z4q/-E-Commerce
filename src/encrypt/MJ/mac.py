import hmac
import hashlib


def generate_mac(message:str, secret_key):

    key_bytes = secret_key.encode("utf-8")
    message_bytes = message.encode("utf-8")

    mac = hmac.new(key_bytes, message_bytes, hashlib.sha256)

    return mac.hexdigest()


def verify_mac(message, secret_key, received_mac):

    calculated_mac = generate_mac(message, secret_key)

    return hmac.compare_digest(calculated_mac, received_mac)


# Example usage
if __name__ == "__main__":
    secret_key = "my_secret_key"
    message = "This is a secret message"

    mac = generate_mac(message, secret_key)
    print(f"Generated MAC: {mac}")

    is_valid = verify_mac(message, secret_key, mac)
    print(f"MAC is valid: {is_valid}")

    is_valid_modified = verify_mac("Modified message", secret_key, mac)
    print(f"MAC is valid for modified message: {is_valid_modified}")
