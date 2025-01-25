def caesar_cipher(text:str, key=3):  
    ciphertext_letter = ""
    for char in text:
        if char.isalpha():
            new_char = ord(char) + key

            if char.islower() and new_char > ord('z'):
                new_char -= 26
            elif char.isupper() and new_char > ord('Z'):
                new_char -= 26

            ciphertext_letter += chr(new_char)
        else:
            ciphertext_letter += char

    return f" {ciphertext_letter}"

plain_text = "mohammed"

ciphertext = caesar_cipher(plain_text)
print(ciphertext)


def caeser_decryption(cipher_letter:str,key = 3):  
    plain_text = ""
    for char in cipher_letter:
        if char.isalpha():
            new_char = ord(char) - key

            if char.islower() and new_char < ord('a'):
                new_char += 26
            elif char.isupper() and new_char < ord('A'):
                new_char += 26

            plain_text += chr(new_char)
        else:
            plain_text += char

    return plain_text


cipher_letter = ciphertext  
plain_text = caeser_decryption(cipher_letter)
print(plain_text)
