def playfair_encrypt(text, key):
    """
    Encrypts the given plaintext using the Playfair cipher.

    Parameters:
        text (str): The plaintext to be encrypted.
        key (str): The key used to generate the Playfair matrix.

    Returns:
        str: The encrypted ciphertext divided into pairs.
    """

    def create_playfair_matrix(key:str):
        """
        Creates the Playfair cipher matrix (5x5) based on the given key.

        Parameters:
            key (str): The key used to populate the matrix.

        Returns:
            list: A 5x5 matrix filled with unique characters from the key and remaining alphabet letters.
        """
        alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"  # Replace "J" with "I"
        key = key.upper().replace("J", "I")
        matrix = []
        used = set()

        # Add unique characters from the key to the matrix
        for char in key:
            if char not in used and char in alphabet:
                matrix.append(char)
                used.add(char)

        # Add the remaining characters from the alphabet
        for char in alphabet:
            if char not in used:
                matrix.append(char)
                used.add(char)

        return [matrix[i : i + 5] for i in range(0, 25, 5)]

    def find_position(matrix, char):
        """
        Finds the position of a character in the Playfair matrix.

        Parameters:
            matrix (list): The Playfair matrix.
            char (str): The character to locate.

        Returns:
            tuple: Row and column of the character in the matrix.
        """
        for row in range(5):
            for col in range(5):
                if matrix[row][col] == char:
                    return row, col
        return None  # Character not found in the matrix

    # Prepare the plaintext: remove non-alphabetic characters and replace "J" with "I"
    text = text.upper().replace("J", "I")
    cleaned_text = ""
    for char in text:
        if char.isalpha():
            cleaned_text += char

    # Insert "X" between duplicate characters in a block
    i = 0
    while i < len(cleaned_text) - 1:
        if cleaned_text[i] == cleaned_text[i + 1]:
            cleaned_text = cleaned_text[: i + 1] + "X" + cleaned_text[i + 1 :]
        i += 2

    # Append "X" if the text length is odd
    if len(cleaned_text) % 2 != 0:
        cleaned_text += "X"

    matrix = create_playfair_matrix(key)
    ciphertext = ""
    i = 0

    # Encrypt the text using the Playfair cipher rules
    while i < len(cleaned_text):
        a = cleaned_text[i]
        b = cleaned_text[i + 1]

        row_a, col_a = find_position(matrix, a)
        row_b, col_b = find_position(matrix, b)

        if row_a == row_b:  # Same row
            ciphertext += matrix[row_a][(col_a + 1) % 5]
            ciphertext += matrix[row_b][(col_b + 1) % 5]
        elif col_a == col_b:  # Same column
            ciphertext += matrix[(row_a + 1) % 5][col_a]
            ciphertext += matrix[(row_b + 1) % 5][col_b]
        else:  # Different row and column
            ciphertext += matrix[row_a][col_b]
            ciphertext += matrix[row_b][col_a]

        i += 2

    # Return the encrypted ciphertext divided into pairs
    return " ".join([ciphertext[i : i + 2] for i in range(0, len(ciphertext), 2)])


def playfair_decrypt(ciphertext, key):
    """
    Decrypts the given ciphertext using the Playfair cipher.

    Parameters:
        ciphertext (str): The encrypted text to be decrypted.
        key (str): The key used to generate the Playfair matrix.

    Returns:
        str: The decrypted plaintext.
    """

    def create_playfair_matrix(key):
        """
        Creates the Playfair cipher matrix (5x5) based on the given key.

        Parameters:
            key (str): The key used to populate the matrix.

        Returns:
            list: A 5x5 matrix filled with unique characters from the key and remaining alphabet letters.
        """
        alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"  # Replace "J" with "I"
        key = key.upper().replace("J", "I")
        matrix = []
        used = set()

        # Add unique characters from the key to the matrix
        for char in key:
            if char not in used and char in alphabet:
                matrix.append(char)
                used.add(char)

        # Add the remaining characters from the alphabet
        for char in alphabet:
            if char not in used:
                matrix.append(char)
                used.add(char)

        return [matrix[i : i + 5] for i in range(0, 25, 5)]

    def find_position(matrix, char):
        """
        Finds the position of a character in the Playfair matrix.

        Parameters:
            matrix (list): The Playfair matrix.
            char (str): The character to locate.

        Returns:
            tuple: Row and column of the character in the matrix.
        """
        for row in range(5):
            for col in range(5):
                if matrix[row][col] == char:
                    return row, col
        return None  # Character not found in the matrix

    # Prepare the ciphertext: remove spaces and convert to uppercase
    ciphertext = ciphertext.replace(" ", "").upper()

    matrix = create_playfair_matrix(key)
    plaintext = ""
    i = 0

    # Decrypt the ciphertext using the Playfair cipher rules
    while i < len(ciphertext):
        a = ciphertext[i]
        b = ciphertext[i + 1]

        row_a, col_a = find_position(matrix, a)
        row_b, col_b = find_position(matrix, b)

        if row_a == row_b:  # Same row
            plaintext += matrix[row_a][(col_a - 1) % 5]
            plaintext += matrix[row_b][(col_b - 1) % 5]
        elif col_a == col_b:  # Same column
            plaintext += matrix[(row_a - 1) % 5][col_a]
            plaintext += matrix[(row_b - 1) % 5][col_b]
        else:  # Different row and column
            plaintext += matrix[row_a][col_b]
            plaintext += matrix[row_b][col_a]

        i += 2

    # Return the plaintext after removing "X" fillers
    return plaintext.replace("X", "")


# Example usage
key = "HELLO WORLD"

text = "HIDE THE GOLDD"
ciphertext = playfair_encrypt(text, key)
# print(ciphertext)
# print(playfair_decrypt(ciphertext, key))
