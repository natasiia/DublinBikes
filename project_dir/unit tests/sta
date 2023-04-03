
import requests
import mysql.connector
import sys
import config

try:
    # Setup the database connection
    with mysql.connector.connect(
            host=config.host,
            user=config.user,
            passwd=config.passwd,
            database=config.db_name,
            auth_plugin='mysql_native_password'
    ) as mydb:
        # Get the data from the API
        url = f"https://api.jcdecaux.com/vls/v1/stations?contract=Dublin&apiKey={config.APIKEY}"
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception if the API request fails
        data = response.json()

        # Create the insert statement for the new data
        sql_insert = "INSERT INTO station (address, banking, bike_stands, bonus, contract_name, name, number, " \
                     "position_lat, position_lng, status) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"

        # Remove foreign key check and truncate existing values
        with mydb.cursor() as mycursor:
            sql_fk_check = "SET FOREIGN_KEY_CHECKS=0; TRUNCATE dublin_bikes_static; SET FOREIGN_KEY_CHECKS=1;"
            mycursor.execute(sql_fk_check)

        # Use bulk insert to insert data
        rows = [(elem["address"], elem["banking"], elem["bike_stands"], elem["bonus"],
               elem["contract_name"], elem["name"], elem["number"], elem["position"]["lat"],
               elem["position"]["lng"], elem["status"]) for elem in data]
        with mydb.cursor() as mycursor:
            mycursor.executemany(sql_insert, rows)
        mydb.commit()

except mysql.connector.Error as err:
    print("Unable to connect to database: {}".format(err))
    sys.exit(1)

except requests.exceptions.RequestException as e:
    print("API request failed: {}".format(e))
    sys.exit(1)
