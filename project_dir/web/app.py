from flask import Flask, render_template, json, request
from db import get_availability_data, get_weather_data, get_station_data, get_station
import pandas as pd  # can use to parse dates

app = Flask(__name__)


# need to load static data from json file
# with open('./static/dublin.json') as file:
#     stations = json.load(file)
# try using function, receive error when called directly
def load_data(filepath):
    """fetching json file with static station data"""
    with open(filepath) as file:
        json_data = json.load(file)
    return json_data


station_data = load_data('static/dublin.json')


@app.route('/')
def index():
    """Loading the main index.html page"""
    # bikes = get_availability_data()
    # weather = get_weather_data()

    # store dates in list
    dates = []
    # for data in range(len(weather)):
    # print(data)
    # date = (pd.to_datetime(weather[data][0]))
    # if date not in dates:
    #     dates.append(date)

    #
    return render_template("index.html", stations=get_station_data(), bikes=get_availability_data(),
                           weather=get_weather_data())


@app.route('/searchStation', methods=['GET'])
def search_station():
    data = get_station(name=request.args.get('name'))
    return json.dumps(data[0])


# @app.route('/retrieveWeather', methods=['GET'])
# def set_weather():
#     data = set_weather(date=request.args.get('date'))


if __name__ == "__main__":
    app.run(debug=True)
