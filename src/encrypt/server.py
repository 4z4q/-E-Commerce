from flask import Flask, request, jsonify
from flask_cors import CORS
from DES import des_decrypt, des_encrypt
from caesar_cipher import caeser_decryption, caesar_cipher
from playfair_cipher import playfair_decrypt, playfair_encrypt
from hill import hill_decrypt, hill_encrypt
from RSA import RSA
from diff import diffie_hellman
from AES import aes_encrypt, aes_decrypt
from rc4 import rc4

app = Flask(__name__)
CORS(app)


@app.route("/encrypt", methods=["POST"])
def encrypt():
    try:
        data = request.json
        text = data.get("text")
        algorithm = data.get("algorithm")
        key = data.get("key")

        if not text or not algorithm or not key:
            return jsonify({"error": "Missing fields"}), 400

        if algorithm == "playfair":
            result = playfair_encrypt(text.replace(" ", ""), key)

        elif algorithm == "caesar":
            result = caesar_cipher(text, int(key))

        elif algorithm == "hill":
            if isinstance(key, list):
                result = hill_encrypt(text, key)
            else:
                return jsonify({"error": "Invalid key format"}), 400

        elif algorithm == "des":
            result = des_encrypt(text, key)

        elif algorithm == "rsa":
            p, q = map(int, key.split(","))
            if not (RSA.is_prime(p) and RSA.is_prime(q)):
                return jsonify({"error": "Both p and q must be prime numbers."}), 400

            result, e, n = RSA.rsa_encryption(text, p, q)
            return jsonify({"encrypted_text": result, "e": e, "n": n})

        elif algorithm == "aes":
            result = aes_encrypt(text, key)

        elif algorithm == "rc4":
            result = rc4(key, text)

        elif algorithm == "dh":
            result = diffie_hellman(int(text), int(key))

        else:
            result = "Invalid algorithm"

        return jsonify({"encrypted_text": result})

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400


@app.route("/decrypt", methods=["POST"])
def decrypt():
    try:
        data = request.json
        text = data.get("text")
        algorithm = data.get("algorithm")
        key = data.get("key")
        e = data.get("e")
        n = data.get("n")

        if not text or not algorithm or not key:
            return jsonify({"error": "Missing fields"}), 400

        if algorithm == "playfair":
            result = playfair_decrypt(text.replace(" ", ""), key)

        elif algorithm == "caesar":
            result = caeser_decryption(text, int(key))

        elif algorithm == "hill":
            if isinstance(key, list):
                result = hill_decrypt(text, key)

        elif algorithm == "rsa":
            p, q = map(int, key.split(","))
            if not (RSA.is_prime(p) and RSA.is_prime(q)):
                return jsonify({"error": "Both p and q must be prime numbers."}), 400

            result = RSA.rsa_decryption(text, p, q, e, n)

        elif algorithm == "dh":
            result = diffie_hellman(text, key)

        elif algorithm == "des":
            result = des_decrypt(text, key)

        elif algorithm == "aes":
            result = aes_decrypt(text, key)

        elif algorithm == "rc4":
            result = rc4(key, text)

        else:
            result = "Invalid algorithm"

        return jsonify({"decrypted_text": result})

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True)
