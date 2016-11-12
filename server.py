import os
import json
from flask import Flask, render_template, request, jsonify
app = Flask(__name__, static_url_path="")

# database stuffs
# import psycopg2
# import urlparse
#
# urlparse.uses_netloc.append("postgres")
# url = urlparse.urlparse(os.environ["DATABASE_URL"])
#
# conn = psycopg2.connect(
#     database=url.path[1:],
#     user=url.username,
#     password=url.password,
#     host=url.hostname,
#     port=url.port
# )

# end database stuffs

ipaddr = os.getenv("IP", "0.0.0.0")
port = int(os.getenv("PORT", 8080))

@app.route('/api/report/<username>', methods = ['POST', 'GET'])
def getsong(username):
    results = request.get_json()
    print username, results['results']
    return jsonify(results)

if __name__ == '__main__':
    app.run(host=ipaddr, port=port, debug=False)
