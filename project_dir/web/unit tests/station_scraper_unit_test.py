import unittest
from unittest.mock import patch, MagicMock
import mysql.connector
import requests
import sys
import io
import config

# Import the optimized code
from optimized_code import main


class TestOptimizedCode(unittest.TestCase):
    def setUp(self):
        # Create a test database connection
        self.mydb = mysql.connector.connect(
            host=config.host,
            user=config.user,
            passwd=config.passwd,
            database=config.db_name,
            auth_plugin='mysql_native_password'
        )

    def tearDown(self):
        # Close the database connection
        self.mydb.close()

    def test_successful_insert(self):
        # Mock the API response
        response_data = [{"address": "123 Main St.", "banking": True, "bike_stands": 10, "bonus": False,
                          "contract_name": "Dublin", "name": "Station 1", "number": 1, "position": {"lat": 1.0, "lng": 2.0},
                          "status": "OPEN"}]
        response = MagicMock()
        response.json.return_value = response_data
        response.raise_for_status.return_value = None

        # Mock the API request
        with patch('requests.get', return_value=response) as mock_request:
            # Call the main function
            main()

            # Check that the data was inserted into the database
            with self.mydb.cursor() as cursor:
                cursor.execute("SELECT COUNT(*) FROM station")
                count = cursor.fetchone()[0]
                self.assertEqual(count, 1)

    def test_api_error(self):
        # Mock an API error
        with patch('requests.get', side_effect=requests.exceptions.RequestException("API request failed")) as mock_request:
            # Redirect stdout to catch the print statement
            sys.stdout = io.StringIO()

            # Call the main function
            main()

            # Check that the error message was printed
            output = sys.stdout.getvalue().strip()
            self.assertEqual(output, "API request failed: API request failed")

            # Check that no data was inserted into the database
            with self.mydb.cursor() as cursor:
                cursor.execute("SELECT COUNT(*) FROM station")
                count = cursor.fetchone()[0]
                self.assertEqual(count, 0)

    def test_database_error(self):
        # Mock a database error
        with patch('mysql.connector.connect', side_effect=mysql.connector.Error("Unable to connect to database")) as mock_connect:
            # Redirect stdout to catch the print statement
            sys.stdout = io.StringIO()

            # Call the main function
            main()

            # Check that the error message was printed
            output = sys.stdout.getvalue().strip()
            self.assertEqual(output, "Unable to connect to database: Unable to connect to database")

            # Check that no data was inserted into the database
            with self.mydb.cursor() as cursor:
                cursor.execute("SELECT COUNT(*) FROM station")
                count = cursor.fetchone()[0]
                self.assertEqual(count, 0)


if __name__ == '__main__':
    unittest.main()
