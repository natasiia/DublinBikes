import requests
from sqlalchemy import create_engine

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
