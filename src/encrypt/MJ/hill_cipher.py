import numpy as np


def text_to_numbers(text: str):
    """Converts text to numerical values based on A=0, B=1, ..., Z=25.

    Parameters:
    text (str): Input text to convert.

    Returns:
    list of int: Numerical values of characters in the text.

    Example:
    >>> text_to_numbers("ABC")
    [0, 1, 2]
    """
    numbers = [ord(char) - ord("A") for char in text.upper()]
    return numbers


def numbers_to_text(numbers: list[int]) -> str:
    """Converts numerical values back to text based on A=0, B=1, ..., Z=25.

    Parameters:
    numbers (list of int): List of numerical values.

    Returns:
    str: Corresponding text.

    Example:
    >>> numbers_to_text([0, 1, 2])
    'ABC'
    """
    text = "".join(chr(num + ord("A")) for num in numbers)
    return text


def hill_encrypt(plain_text: str, key_matrix: np.ndarray, filler: str = "X") -> str:
    """Encrypts a plaintext using the Hill cipher.

    Parameters:
    plain_text (str): Text to encrypt.
    key_matrix (numpy.ndarray): Encryption key matrix.
    filler (str): Character to pad the plaintext for alignment with key matrix size.

    Returns:
    str: Encrypted ciphertext.

    Example:
    >>> key_matrix = np.array([[5, 6], [2, 3]])
    >>> hill_encrypt("ANAS", key_matrix)
    'WAEH'
    """
    numbers = text_to_numbers(plain_text)

    while len(numbers) % len(key_matrix) != 0:
        numbers.append(ord(filler) - ord("A"))  # Add filler to align with matrix size

    chunks = [
        numbers[i : i + len(key_matrix)]
        for i in range(0, len(numbers), len(key_matrix))
    ]
    encrypted_chunks = []

    for chunk in chunks:
        chunk_matrix = np.array(chunk).reshape(-1, 1)
        encrypted_chunk = np.dot(key_matrix, chunk_matrix) % 26
        encrypted_chunks.extend(encrypted_chunk.flatten()) # Convert the matrix to the one dimension

    encrypted_text = numbers_to_text(encrypted_chunks)
    return encrypted_text


def hill_decrypt(cipher_text: str, key_matrix: np.ndarray) -> str:
    """Decrypts a ciphertext encrypted using the Hill cipher.

    Parameters:
    cipher_text (str): Encrypted text to decrypt.
    key_matrix (numpy.ndarray): Encryption key matrix.

    Returns:
    str: Decrypted plaintext.

    Example:
    >>> key_matrix = np.array([[5, 6], [2, 3]])
    >>> hill_decrypt("WAEH", key_matrix)
    'ANAS'
    """
    determinant = int(round(np.linalg.det(key_matrix)))  # Compute determinant
    determinant_mod_inverse = pow(determinant, -1, 26)  # Modular inverse of determinant
    adjugate_matrix = np.round(np.linalg.inv(key_matrix) * determinant).astype(
        int
    )  # Compute adjugate matrix
    inverse_key_matrix = (determinant_mod_inverse * adjugate_matrix) % 26

    numbers = text_to_numbers(cipher_text)
    chunks = [
        numbers[i : i + len(key_matrix)]
        for i in range(0, len(numbers), len(key_matrix))
    ]
    decrypted_chunks = []

    for chunk in chunks:
        chunk_matrix = np.array(chunk).reshape(-1, 1)
        decrypted_chunk = np.dot(inverse_key_matrix, chunk_matrix) % 26
        decrypted_chunks.extend(decrypted_chunk.flatten())

    decrypted_text = numbers_to_text(decrypted_chunks)
    return decrypted_text


# Example usage:
plain_text = "Mohammed"
key_matrix_2x2 = np.array([[5, 6], [2, 3]])

encrypted_text_2x2 = hill_encrypt(plain_text, key_matrix_2x2)
decrypted_text_2x2 = hill_decrypt(encrypted_text_2x2, key_matrix_2x2)

print("Encrypted (2x2):", encrypted_text_2x2)
print("Decrypted (2x2):", decrypted_text_2x2)
