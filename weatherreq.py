import requests
from sqlalchemy import create_engine
import json

api_key = 'ef8a3722135be9a302f5ea61c8a732ae'

city = 'Dublin'
country_code = 'ie'

# create the API request URL
url = f'https://api.openweathermap.org/data/2.5/weather?q={city},{country_code}&appid={api_key}'

# send the API request and get the response
response = requests.get(url)

# extract the weather information from the response
weather_data = response.json()
print(weather_data)

URI = "dbbikes.cjkdeoopykqz.us-east-1.rds.amazonaws.com"
PORT = "3306"
DB = "dbbikes"
USER = "anastasiia"

#MySQL-connector-python
engine = create_engine("mysql+mysqlconnector://{}:{}@{}:{}/{}".format(USER, PASSWORD, URI, PORT, DB), echo = True)

for res in engine.execute("SHOW VARIABLES;"):
    print(res)
    
sql = """
CREATE TABLE IF NOT EXISTS weather_history (
date_time INTEGER PRIMARY KEY,
weather_id INTEGER,
weather_main VARCHAR(256),
weather_description VARCHAR(256),
temperature DOUBLE,
temp_feels_like DOUBLE,
pressure INTEGER,
humidity INTEGER,
visibility INTEGER,
wind_speed DOUBLE,
rain_volume DOUBLE
)
"""

try:
    res = engine.execute(sql)
    print(res.fetchall())
except Exception as e:
    print(e)

#inserting rows into weather_history table
def weather_to_db(weather_data):
    
    sql_insert = "INSERT INTO weather_history (date_time, weather_id, weather_main, weather_description, temperature, temp_feels_like,pressure, humidity, visibility, wind_speed,rain_volume) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"   
    vals = (int(weather_data["dt"]), weather_data["weather"][0]["id"], weather_data["weather"][0]["main"], weather_data["weather"][0]["description"], weather_data["main"]["temp"], weather_data["main"]["feels_like"], weather_data["main"]["pressure"], weather_data["main"]["humidity"], weather_data["visibility"], weather_data["wind"]["speed"], weather_data.get("rain", {}).get("1h", None))
    
    #execute query
    try:
        engine.execute(sql_insert, vals)
    except Exception as e:
        print("Error inserting row:", e)

    return

weather_to_db(weather_data)
