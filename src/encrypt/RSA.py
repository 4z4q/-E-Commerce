class RSA:
    @staticmethod
    def is_prime(num):
        """Check if a number is prime."""
        if num <= 1:
            return False
        if num <= 3:
            return True
        if num % 2 == 0 or num % 3 == 0:
            return False
        i = 5
        while i * i <= num:
            if num % i == 0 or num % (i + 2) == 0:
                return False
            i += 6
        return True

    @staticmethod
    def gcd_of_two_numbers(a, b):
        """Compute the greatest common divisor (GCD) of two numbers."""
        while b != 0:
            a, b = b, a % b
        return a

    @staticmethod
    def get_multiplicative_inverse(a, m):
        """
        Compute the multiplicative inverse of `a` modulo `m` using the Extended Euclidean Algorithm.
        """
        m0, x0, x1 = m, 0, 1
        while a > 1:
            q = a // m
            a, m = m, a % m
            x0, x1 = x1 - q * x0, x0
        return x1 + m0 if x1 < 0 else x1

    @staticmethod
    def rsa_encryption(plaintext, p, q):
        """
        Encrypt plaintext using RSA algorithm.
        """
        if not (RSA.is_prime(p) and RSA.is_prime(q)):
            raise ValueError("Both p and q must be prime numbers.")

        n = p * q
        phi = (p - 1) * (q - 1)

        # Choose e such that 1 < e < phi and gcd(e, phi) = 1
        e = 3
        while RSA.gcd_of_two_numbers(e, phi) != 1:
            e += 2

        # Encrypt the plaintext
        ciphertext = []
        for char in plaintext:
            P = ord(char)
            C = pow(P, e, n)  # Efficient modular exponentiation
            ciphertext.append(C)
        return ciphertext, e, n

    @staticmethod
    def rsa_decryption(ciphertext, p, q, e, n):
        """
        Decrypt ciphertext using RSA algorithm.
        """
        phi = (p - 1) * (q - 1)

        # Compute the private key d
        d = RSA.get_multiplicative_inverse(e, phi)

        # Decrypt the ciphertext
        plaintext = []
        for C in ciphertext:
            P = pow(C, d, n)  # Efficient modular exponentiation
            plaintext.append(chr(P))
        return "".join(plaintext)


# Example usage
message = "HELLO RSA"
p = 61
q = 53

# Encrypt the message
encrypted_message, e, n = RSA.rsa_encryption(message, p, q)
print("Encrypted Message:", encrypted_message)

# Decrypt the message
decrypted_message = RSA.rsa_decryption(encrypted_message, p, q, e, n)
print("Decrypted Message:", decrypted_message)


