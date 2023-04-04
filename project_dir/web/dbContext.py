from utils import hash_password
import config
import pymysql


# # specify connection details db_connection = pymysql.connect(host=config.hostname, user=config.username,
# password=config.password, db=config.db_name, port=config.port)
def get_db_connection():
    return pymysql.connect(host=config.hostname, user=config.username, password=config.password,
                           db=config.db_name,
                           port=config.port)


# Mock db
db = []


# Register function will check if the user already exists, if they do it will return false. If the registration
# was successful  true will be returned. The user password will be hashed for data security
def register(first_name, last_name, email, password):
    db_connection = get_db_connection()
    """Retrieves weather data from the database"""

    # STATEMENT TO SELECT ALL DATA
    select_user_query = "SELECT entry_id FROM user WHERE email LIKE '" + email + "';"
    # print(select_user_query)
    # Connection String
    cursor = db_connection.cursor()
    # Execute Statement
    cursor.execute(select_user_query)
    # save the data
    user_data = cursor.fetchall()

    if len(user_data) != 0:
        return [False, 'User already exists']
    insert_user_query = "INSERT INTO user(first_name, last_name, email, password_hash) " \
                        "VALUES('" + first_name + "','" + last_name + "','" + email + "','" + hash_password(
        password) + "'); "
    cursor.execute(insert_user_query)
    db_connection.commit()
    db_connection.close()

    return [True, 'User successfully registered']


# The login function will scan the user table for the email and then compare the provided password.
# If the password is incorrect or the email is not found false will be returned
def login(email, password):
    db_connection = get_db_connection()
    """Retrieves use data from the database"""

    select_user_query = "SELECT entry_id FROM user WHERE email LIKE '" + email + "' AND password_hash = '" + hash_password(
        password) + "';"
    cursor = db_connection.cursor()
    cursor.execute(select_user_query)
    user_data = cursor.fetchall()
    return len(user_data) == 1


# retrieve data from database
def get_station_data():
    db_connection = get_db_connection()
    """Retrieves station data from the database"""

    # STATEMENT TO SELECT ALL DATA
    select_stations = "SELECT name, number FROM dbbikes.station"
    # Connection String
    cursor = db_connection.cursor()
    # Execute Statement
    cursor.execute(select_stations)
    # save the data
    select_stations = cursor.fetchall()
    db_connection.commit()
    db_connection.close()
    # return availability data
    return select_stations


def get_station(name):
    db_connection = get_db_connection()
    """Retrieves station data from the database"""

    # STATEMENT TO SELECT ALL DATA
    select_station = "SELECT s.name, a.available_bike_stands, a.available_bikes, a.status FROM dbbikes.availability a " \
                     "INNER JOIN dbbikes.station s ON a.number = s.number WHERE s.name LIKE '%" + name + "%' ORDER BY " \
                                                                                                         "a.last_update LIMIT 1 "

    # Connection String
    cursor = db_connection.cursor()
    # Execute Statement
    cursor.execute(select_station)
    # save the data
    select_stations = cursor.fetchall()
    db_connection.commit()
    db_connection.close()
    # return availability data
    return select_stations


# functions to retrieve all dynamic data from database
# decided to add static data (stations) as json file
# retrieve data from database
def get_weather_data():
    db_connection = get_db_connection()
    """Retrieves weather data from the database"""

    # STATEMENT TO SELECT ALL DATA
    select_weather = "SELECT weather_description, temperature, temp_feels_like, humidity FROM dbbikes.weather_history " \
                     "ORDER BY date_time DESC LIMIT 1;"
    # Connection String
    cursor = db_connection.cursor()
    # Execute Statement
    cursor.execute(select_weather)
    # save the data
    weather_data = cursor.fetchall()
    db_connection.commit()
    db_connection.close()
    # return weather data
    return weather_data


# retrieve data from database
def get_availability_data():
    db_connection = get_db_connection()
    """Retrieves station data from the database"""

    # STATEMENT TO SELECT ALL DATA
    select_availability = "SELECT * FROM dbbikes.availability"
    # Connection String
    cursor = db_connection.cursor()
    # Execute Statement
    cursor.execute(select_availability)
    # save the data
    availability_data = cursor.fetchall()
    db_connection.commit()
    db_connection.close()
    # return availability data
    return availability_data
