import random

def power_mod(base, exponent, modulus):
    """
    Computes (base^exponent) % modulus efficiently.
    
    Parameters:
        base (int): The base number.
        exponent (int): The exponent.
        modulus (int): The modulus.
    
    Returns:
        int: The result of (base^exponent) % modulus.
    """
    return pow(base, exponent, modulus)

def diffie_hellman(prime, generator):
    """
    Implements the Diffie-Hellman key exchange algorithm to compute shared secrets.

    Parameters:
        prime (int): A large prime number.
        generator (int): A primitive root modulo prime.

    Returns:
        tuple: A tuple containing the shared secrets computed by both parties.
               The two shared secrets should be equal if the algorithm works correctly.
    """
    # Generate private keys for both parties
    aPrivate = random.randint(1, prime - 1)
    bPrivate = random.randint(1, prime - 1)

    # Compute public keys for both parties
    aPublic = power_mod(generator, aPrivate, prime)
    bPublic = power_mod(generator, bPrivate, prime)

    # Compute the shared secrets
    aShared = power_mod(bPublic, aPrivate, prime)
    bShared = power_mod(aPublic, bPrivate, prime)

    return aShared, bShared

# Example usage
prime = 11  # Example prime number (should be a large prime in real scenarios)
gen = 5     # Example generator (primitive root modulo prime)

key1, key2 = diffie_hellman(prime, gen)

print("Shared Key 1:", key1)
print("Shared Key 2:", key2)

# Verify the shared keys match
assert key1 == key2, "Error: Shared keys do not match!"
