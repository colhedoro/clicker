import os

from flask import Flask, flash, jsonify, redirect, render_template, request, session, send_from_directory, url_for
from flask_session import Session
from tempfile import mkdtemp

# Configure application
app = Flask(__name__)


# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Ensure responses aren't cached.
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

@app.route("/")
def index():
    gheaders = True
    return render_template("index.html", gheaders=gheaders)

@app.route("/mobile")
def mobile():
    gheaders = False
    return render_template("mobile.html", gheaders=gheaders)

@app.route("/about")
def about():
    gheaders = False
    return render_template("about.html", gheaders=gheaders)

if __name__ == '__main__':
    app.run()