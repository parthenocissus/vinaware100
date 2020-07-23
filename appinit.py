from flask import Flask, jsonify, render_template, request
import tensorflow as tf
from textgenrnn import textgenrnn
import json
import cyrtranslit
import random
import datetime

appinit = Flask(__name__)

@appinit.before_first_request
def create_model():

    print("LOADING...")

    global textgens, textgen, default_input_words, graph
    textgen = None
    textgens = []
    default_input_words = []
    temp = [1.0, 0.5, 0.2, 0.9]

    for i in range(1, 2):
        wp = 'model/vinaware' + str(i) + '_weights.hdf5'
        vp = 'model/vinaware' + str(i) + '_vocab.json'
        cp = 'model/vinaware' + str(i) + '_config.json'
        itextgen = textgenrnn(weights_path=wp, vocab_path=vp, config_path=cp)
        iwords = itextgen.generate_random_start(temperature=temp, max_gen_length=1, interactive=True)
        object = {"txtgen": itextgen, "words": iwords}
        textgens.append(object)

    new_textgen = random.choice(textgens)
    default_input_words = new_textgen["words"]
    textgen = new_textgen["txtgen"]


@appinit.route('/_log')
def log():
    
    strigified_log_text = request.args.get('vector')
    json_log_text = json.loads(strigified_log_text)
    text_to_be_saved = json_log_text.get("text")

    # LOGGING
    # timestamp = datetime.datetime.now().strftime("%Y-%m-%dT%H-%M-%S-%f")
    # filename = 'log_' + timestamp + '.txt'
    # f = open(filename,'w')
    # f.write(text_to_be_saved)
    # f.close()

    okay = json.dumps(json_log_text)
    return okay 



@appinit.route('/_generate')
def generate():

    print("generating...")

    global textgens, textgen, default_input_words, graph
    # old_temp = [0.5]
    temp = [1.0, 0.5, 0.2, 0.9]
    puncts = '''!()-[]{};:'"\,<>./?@#$%^&*_~'''

    strigified_seedwords = request.args.get('vector')
    json_seedwords = json.loads(strigified_seedwords)
    input_words = json_seedwords.get("seedwords", [""])
    max_depth = int(json_seedwords.get("depth")) + 1

    listlen = len(input_words)
    wordlen = len(input_words[0])

    if listlen == 1 and wordlen == 0:

        new_textgen = random.choice(textgens)
        default_input_words = new_textgen["words"]
        textgen = new_textgen["txtgen"]
        max_depth = int(json_seedwords.get("depth")) + 1

        i0 = random.randint(0, len(default_input_words) - 41)
        i1 = i0 + 40
        input_words = default_input_words[i0:i1]
        last_word = input_words[-1]

        while last_word[0] in puncts:
            i0 = random.randint(0, len(default_input_words) - 41)
            i1 = i0 + 40
            input_words = default_input_words[i0:i1]
            last_word = input_words[-1]

    input_words = [cyrtranslit.to_latin(word) for word in input_words]

    print("TEXTGEN:")
    print(textgen)

    generated_text = textgen.generate_special(temperature=temp,
                                   max_gen_length=1,
                                   interactive=True,
                                   top_n=2,
                                   input_text=input_words,
                                   input_depth=max_depth)

    txt_json = json.dumps(generated_text)
    print("TEXT JSON:")
    print(txt_json)
    return txt_json


@appinit.route('/')
def index():
    return render_template('index.html')


@appinit.route('/red')
def index_red():
    return render_template('index_red.html')


@appinit.route('/zoom')
def index_zoom():
    return render_template('index_zoom.html')


if __name__ == '__main__':
    print('Loading model...')
    # load()
    # appinit.run(host='0.0.0.0')
    appinit.run(threaded=True)

