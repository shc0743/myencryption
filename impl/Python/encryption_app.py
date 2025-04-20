import json
import getpass
from encryption import encrypt_data, decrypt_data

def display_menu():
    print("\n=== Encryption/Decryption Tool ===")
    print("1. Encrypt a message")
    print("2. Decrypt a message")
    print("3. Exit")
    print("4. Custom phrase")
    print("5. Custom phrase and N")
    choice = input("Please choose an option (1-4): ")
    return choice.strip()

def encrypt_interaction(phrase=None, n=None):
    print("\n--- Encryption ---")
    message = input("Enter the message to encrypt: ")
    password = getpass.getpass("Enter encryption password: ")
    
    try:
        encrypted_result = encrypt_data(message, password, phrase, n)
        print("\nEncryption successful!")
        print("Result (use this for decryption):")
        print(encrypted_result)  # 直接打印JSON字符串
    except Exception as e:
        print(f"\nEncryption failed: {str(e)}")

def decrypt_interaction():
    print("\n--- Decryption ---")
    encrypted_json = input("Enter the encrypted JSON data: ")
    
    try:
        password = getpass.getpass("Enter decryption password: ")
        decrypted_message = decrypt_data(encrypted_json, password)
        print("\nDecryption successful!")
        print("Decrypted message:")
        print(decrypted_message)
    except json.JSONDecodeError:
        print("\nError: Invalid JSON format")
    except Exception as e:
        print(f"\nDecryption failed: {str(e)}")

def main():
    while True:
        choice = display_menu()
        
        if choice == "1":
            encrypt_interaction()
        elif choice == "2":
            decrypt_interaction()
        elif choice == "3":
            print("Exiting the program. Goodbye!")
            break
        elif choice == "4":
            encrypt_interaction(input('Phrase: '))
        elif choice == "5":
            encrypt_interaction(input('Phrase: '), int(input('N')))
        else:
            print("Invalid choice. Please enter 1-4.")
        
        input("\nPress Enter to continue...")

if __name__ == "__main__":
    main()