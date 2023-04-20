import domain as ValidationResponse
import re
import config
import hashlib


def validate_register_information(first_name, last_name, email, password, confirm_password):
    response = ValidationResponse(True, [])

    if len(first_name) < 1:
        response.data.append(['Invalid First Name', 'FirstName'])
        response.results = False

    if len(last_name) < 1:
        response.data.append(['Invalid Last Name', 'LastName'])
        response.results = False

    if password != confirm_password:
        response.data.append(['Passwords do not match', 'ConfirmPassword'])
        response.results = False

    if len(password) < 8:
        response.data.append(['Password must at least be 8 characters long', 'Password'])
        response.results = False

    if not re.search("[a-z]", password):
        response.data.append(['Password must contain at least be 1 lowercase character', 'Password'])
        response.results = False

    if not re.search("[A-Z]", password):
        response.data.append(['Password must contain at least be 1 uppercase character', 'Password'])
        response.results = False

    if not re.search(r"[^@]+@[^@]+\.[^@]+", email):
        response.data.append(['Invalid email address', 'Email'])
        response.results = False

    return response


# This function will hash the user password using a salt
def hash_password(password):
    return hashlib.sha224(str(password + config.salt).encode('utf-8')).hexdigest()
