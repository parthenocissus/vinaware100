from flask import Flask, render_template

appinit = Flask(__name__)

@appinit.route('/')
def index_text_to_points_lab():
    return render_template('text_to_points_lab.html')

if __name__ == '__main__':
    appinit.run(threaded=True)

