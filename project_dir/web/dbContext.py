from utils import hash_password
import config
import pymysql
import json

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
    select_stations = "SELECT address, banking, bike_stands, bonus, contract_name, name, number, position_lat, position_lng FROM dbbikes.station"

    # Connection String
    cursor = db_connection.cursor()
    # Execute Statement
    cursor.execute(select_stations)
    # save the data
    select_stations = cursor.fetchall()
    
    # convert data to JSON format
    station_data = []
    for row in select_stations:
        station_data.append({'address': row[0], 'banking': row[1], 'bike_stands': row[2], 'bonus': row[3], 'contract_name': row[4], 'name': row[5], 'number': row[6], 'position_lat': row[7], 'position_lng': row[8]})
    
    db_connection.commit()
    db_connection.close()
    # return availability data as JSON response
    return station_data

def get_station(name):
    db_connection = get_db_connection()
    """Retrieves station data from the database"""

     # STATEMENT TO SELECT ALL DATA
    select_station = "SELECT s.name, a.available_bike_stands, a.available_bikes, a.status FROM dbbikes.availability a " \
                     "INNER JOIN dbbikes.station s ON a.number = s.number WHERE s.name LIKE %s ORDER BY " \
                     "a.last_update LIMIT 1"

    # Connection String
    cursor = db_connection.cursor()
    # Execute Statement
    cursor.execute(select_station, (f"%{name}%",))
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
    select_weather = "SELECT weather_description, temperature, temp_feels_like, pressure, humidity, visibility, wind_speed FROM dbbikes.weather_history " \
                     "ORDER BY date_time DESC LIMIT 1, 1;"
    # Connection String
    cursor = db_connection.cursor()
    # Execute Statement
    cursor.execute(select_weather)
    # save the data
    weather_data = cursor.fetchall()
    
    # convert data to JSON format
    weather = []
    for row in weather_data:
        weather.append({'weather_description': row[0], 'temperature': row[1], 'temp_feels_like': row[2], 'pressure': row[3], 'humidity': row[4], 'visibility': row[5], 'wind_speed': row[6]})
        
    db_connection.commit()
    db_connection.close()
    # return weather data
    return json.dumps(weather)


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
    
    # convert data to JSON format
    availability = []
    for row in availability_data:
        availability.append({'entry_id': row[0], 'available_bikes': row[1], 'available_bike_stands': row[2], 'number': row[3], 'status': row[4], 'last_update': row[5]})
    
    db_connection.commit()
    db_connection.close()
    # return availability data
    return json.dumps(availability)

def get_stations_availability():
    """
    Retrieve the most recent availability data for all stations.

    Returns:
        A dictionary of station names to availability data.
    """
    conn = get_db_connection()
    cur = conn.cursor()

    # Map station names to numbers
    cur.execute("SELECT name, number FROM station")
    name_to_number = dict(cur.fetchall())

    # Get latest availability data for each station
    cur.execute('''
        SELECT s.name, a1.available_bike_stands, a1.available_bikes, a1.status
        FROM station s
        INNER JOIN (
            SELECT number, MAX(last_update) AS last_update
            FROM availability
            GROUP BY number
        ) latest_availability
        ON s.number = latest_availability.number
        INNER JOIN availability a1 ON a1.number = s.number AND a1.last_update = latest_availability.last_update;
    ''')
    results = cur.fetchall()

    # Create availability dictionary, checking if station exists in name_to_number mapping
    current_availability = {}
    for station in results:
        station_name = station[0]
        if station_name in name_to_number:
            number = name_to_number[station_name]
            current_availability[station_name] = {
                "available_stands": station[1],
                "available_bikes": station[2],
                "status": station[3]
            }
        else:
            print(f"Skipping row for unknown station name: {station_name}")

    conn.close()
    return current_availability
