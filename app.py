from flask import Flask, jsonify, render_template, request
from textgenrnn import textgenrnn
import json
import cyrtranslit
import random

app = Flask(__name__)

textgen = None
textgens = []
default_input_words = []

@app.before_first_request
def create_model():

    global textgen
    global default_input_words
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

@app.route('/_generate')
def generate():

    global default_input_words
    global textgen
    # old_temp = [0.5]
    temp = [1.0, 0.5, 0.2, 0.9]
    puncts = '''!()-[]{};:'"\,<>./?@#$%^&*_~'''

    strigified_seedwords = request.args.get('vector')
    json_seedwords = json.loads(strigified_seedwords)
    input_words = json_seedwords.get("seedwords", [""])

    listlen = len(input_words)
    wordlen = len(input_words[0])

    if listlen == 1 and wordlen == 0:

        new_textgen = random.choice(textgens)
        default_input_words = new_textgen["words"]
        textgen = new_textgen["txtgen"]

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

    generated_text = textgen.generate_special(temperature=temp,
                                   max_gen_length=1,
                                   interactive=True,
                                   top_n=2,
                                   input_text=input_words,
                                   input_depth=6)
    txt_json = json.dumps(generated_text)
    print(txt_json)
    return txt_json

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(threaded=True)

