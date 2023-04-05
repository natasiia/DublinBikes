import config
import sqlalchemy as sqla
from sqlalchemy import create_engine, insert
from sqlalchemy import Column, Integer, DateTime

import requests
import datetime

# Create the engine object for connecting to the database
db_username = config.user
db_password = config.passwd
db_name = config.db_name
db_host = config.host
db_port = config.port
engine = create_engine(
    f"mysql+mysqldb://{db_username}:{db_password}@{db_host}:{db_port}/{db_name}",
    pool_pre_ping=True,  # Test connections for liveness upon checkout
    pool_recycle=3600,   # Recycle connections after 1 hour of idle time
    fast_executemany=True # Execute multiple inserts as a single SQL command
)

# Define the metadata and availability table
metadata = sqla.MetaData()
availability = sqla.Table(
    'availability',
    metadata,
    Column('available_bikes', Integer),
    Column('available_bike_stands', Integer),
    Column('number', Integer, primary_key=True),
    Column('last_update', DateTime, primary_key=True)
)

# JCDecaux API endpoint and parameters
JCDECAUX_URL = config.STATIONS_URI
API_KEY = config.APIKEY
CONTRACT_NAME = config.NAME


def fetch_and_insert_data():
    # Make a request to the JCDecaux API to get the station data
    r = requests.get(JCDECAUX_URL, params={
                     'apiKey': API_KEY, 'contract': CONTRACT_NAME})

    # Convert the response data to a list of dictionaries
    data = r.json()

    # Get the current UTC timestamp as a datetime object
    now = datetime.datetime.utcnow()

    # Create a list of dictionaries with the data to be inserted into the availability table
    rows = [
        {
            'available_bikes': station['available_bikes'],
            'available_bike_stands': station['available_bike_stands'],
            'number': station['number'],
            'last_update': now
        }
        for station in data
    ]

    # Insert the data into the availability table
    with engine.connect() as conn:
        stmt = insert(availability).values(rows)
        conn.execute(stmt)


# Unit tests

def test_fetch_and_insert_data():
    fetch_and_insert_data()

    with engine.connect() as conn:
        result = conn.execute(availability.select())
        rows = result.fetchall()
        assert len(rows) > 0
        for row in rows:
            assert isinstance(row[0], int)  # available_bikes
            assert isinstance(row[1], int)  # available_bike_stands
            assert isinstance(row[2], int)  # number
            assert isinstance(row[3], datetime.datetime)  # last_update

if __name__ == '__main__':
    test_fetch_and_insert_data()
