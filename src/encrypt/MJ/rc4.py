def rc4(key, plaintext):
    """
    Encrypts or decrypts the given plaintext using the RC4 stream cipher algorithm.

    Parameters:
        key (str): The secret key used for encryption/decryption.
        plaintext (str): The text to encrypt or decrypt.

    Returns:
        str: The resulting ciphertext (if encrypting) or plaintext (if decrypting).
    """

    # Step 1: Initialize the state vector S and temporary vector T
    S = list(range(256))  # State vector S initialized to values 0 through 255
    T = [ord(key[i % len(key)]) for i in range(256)]  # Repeat the key to fill T

    # Step 2: Key scheduling algorithm (KSA)
    j = 0
    for i in range(256):
        j = (j + S[i] + T[i]) % 256
        S[i], S[j] = S[j], S[i]  # Swap values in S based on key

    # Step 3: Pseudo-random generation algorithm (PRGA)
    i = j = 0
    keystream = []
    for _ in range(len(plaintext)):
        i = (i + 1) % 256
        j = (j + S[i]) % 256
        S[i], S[j] = S[j], S[i]  # Swap values in S to produce randomness
        keystream.append(S[(S[i] + S[j]) % 256])  # Generate keystream byte

    # Step 4: XOR plaintext with keystream to produce ciphertext
    ciphertext = []
    for p, k in zip(plaintext, keystream):
        ciphertext.append(chr(ord(p) ^ k))  # XOR each character with keystream byte

    return "".join(ciphertext)  # Combine characters into a single string


# Example usage
key = "secretkey"  # The secret key
plaintext = "hello world"  # The plaintext message

# Encryption
ciphertext = rc4(key, plaintext)
print("Ciphertext:", ciphertext)

# Decryption (same function used for decryption)
decrypted_text = rc4(key, ciphertext)
print("Decrypted text:", decrypted_text)
