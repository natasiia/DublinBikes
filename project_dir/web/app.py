import json

from flask import Flask, session, url_for, request, render_template, redirect, g
import os
import dbContext
import utils

app = Flask(__name__, template_folder='templates')
app.secret_key = os.urandom(24)


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        session.pop('user', None)
        if dbContext.login(request.form['email'], request.form['password']):
            session['user'] = request.form['email']
            return redirect(url_for('dashboard'))
        else:
            return render_template('index.html', results=False)
    if session.get('from_register_page'):
        return render_template('index.html', from_register_page=True)
    return render_template('index.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        validation_results = utils.validate_register_information(request.form['firstName'], request.form['lastName'],
                                                                 request.form['email'], request.form['password'],
                                                                 request.form['confirmPassword'])
        if not validation_results.results:
            return render_template('register.html', errors=validation_results.data)

        results = dbContext.register(request.form['firstName'], request.form['lastName'], request.form['email'],
                                     request.form['password'])
        if results[0]:
            session['from_register_page'] = True
            return redirect(url_for('index', from_register_page=True))
        else:
            return render_template('register.html', errors=results[1])
    return render_template('register.html')

@app.route('/searchStation', methods=['GET'])
def search_station():
    try:
        # return "Pew Pew", 404
        data = dbContext.get_station(name=request.args.get('name'))
        if len(data) < 1:
            return "Station not found.", 404
        return json.dumps(data[0])

    except Exception as e:
        return f"Something went wrong. Please try again. {e}", 500


@app.route('/dashboard')
def dashboard():
    if g.user:
        stations = dbContext.get_station_data()
        bikes = dbContext.get_availability_data()
        weather = dbContext.get_weather_data()
        
        return render_template('dashboard.html', weather=weather, bikes=bikes, stations=stations)
    return redirect(url_for('index'))

@app.before_request
def before_request():
    g.user = None
    if 'user' in session:
        g.user = session['user']

@app.template_filter("tojson")
def tojson_filter(value):
    return json.dumps(value)

if __name__ == '__main__':
    app.run(debug=True)
