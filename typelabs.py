from flask import Flask, render_template

appinit = Flask(__name__)

@appinit.route('/')
def index_textlabs():
    return render_template('textlabs.html')

@appinit.route('/prln')
def index_textlabs_perlin():
    return render_template('textlabs-perlin.html')

if __name__ == '__main__':
    appinit.run(threaded=True)

