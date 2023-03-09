import pymysql
import config


# # specify connection details db_connection = pymysql.connect(host=config.hostname, user=config.username,
# password=config.password, db=config.db_name, port=config.port)
def get_db_connection():
    return pymysql.connect(host=config.hostname, user=config.username, password=config.password,
                           db=config.db_name,
                           port=config.port)


# functions to retrieve all dynamic data from database
# decided to add static data (stations) as json file
# retrieve data from database
def get_weather_data():
    db_connection = get_db_connection()
    """Retrieves weather data from the database"""

    # STATEMENT TO SELECT ALL DATA
    select_weather = "SELECT * FROM dbbikes.weather_history" #SELECT weather_history.date_time, weather_history.weather_description, weather_history.temperature, weather_history.wind_speed FROM dbbikes.weather_history;
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
    select_station = "SELECT s.name, a.available_bike_stands, a.available_bikes, s.status FROM dbbikes.availability a INNER JOIN dbbikes.station s ON a.number = s.number WHERE s.name LIKE '%" + name + "%' ORDER BY a.last_update LIMIT 1"

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


# select_stations = "SELECT * FROM dbbikes.station"
# cursor.execute(select_availability, select_stations, select_weather)
