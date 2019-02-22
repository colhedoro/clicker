import os

from flask import Flask, flash, jsonify, redirect, render_template, request, session, send_from_directory, url_for
from flask_session import Session
from tempfile import mkdtemp

# Configure application
app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")

if __name__ == '__main__':
    app.run()