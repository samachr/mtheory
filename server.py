import os
import json
import db_utils
import simplejson as json
from flask import Flask, render_template, request, jsonify, redirect
app = Flask(__name__, static_url_path="")
db = db_utils.DBconnector(os.environ["DATABASE_URL"])

@app.route('/')
def index_redirect():
    return redirect('/index.html')

@app.route('/api/report/<username>', methods = ['POST'])
def postresults(username):
    results = request.get_json()['results']
    for result in results:
        previous = db.query("select * from userdata where username = %s and key = %s and scaledegree = %s", [username, str(result["key"]), result["scaledegree"]])
        if len(previous) == 0:
            db.insert("insert into userdata (username, key, scaledegree, totalanswered, totalcorrect, averagetime) values(%s, %s, %s, %s, %s, %s)",
                [username, result['key'], result['scaledegree'], 1, 1 if result['correct'] else 0, result['time']])
        else:
            previous = previous[0]
            previous_id = previous[0]
            previous_username = previous[1]
            previous_key = previous[2]
            previous_scaledegree = previous[3]
            previous_totalanswered = previous[4]
            previous_totalcorrect = previous[5]
            previous_averagetime = previous[6]

            if previous_totalanswered <= 10:
                new_average = (result['time'] + previous_averagetime * previous_totalanswered) / (previous_totalanswered + 1)
            else:
                new_average = (result['time'] + previous_averagetime * 9) / 10

            db.update("update userdata set totalanswered = %s, totalcorrect = %s, averagetime = %s where id = %s",
                [previous['totalanswered'] + 1, previous['totalcorrect'] + 1 if result['correct'] else 0,  new_average, previous['id']])

    return json.dumps(results)

@app.route('/api/report/<username>', methods = ['GET'])
def get_data(username):
    return jsonify(db.query("select * from userdata where username = %s order by key", [username]))

@app.route('/api/exercises/<username>', methods = ['GET'])
def get_exercise(username):
    userdata = db.query("select * from userdata where username = %s order by key", [username])
    all_possible = {}
    for keynum in xrange(12):
        for scaledegree in xrange(1, 8):
            all_possible[keynum, scaledegree] = float("inf")

    for data in userdata:
        all_possible[int(data[2]), data[3]] = float(data[6]) + 10000 / data[5]

    next_set = []
    for data in sorted(all_possible, key=all_possible.get, reverse=True)[:5]:
        next_set.append({"key": data[0], "scaledegree": data[1]})

    return jsonify(next_set)

if __name__ == '__main__':
    app.run(host=os.getenv("IP", "0.0.0.0"), port=int(os.getenv("PORT", 8080)), debug=False)
