from keras.callbacks import LearningRateScheduler, Callback
from keras.models import Model, load_model
from keras.preprocessing import sequence
from keras.preprocessing.text import Tokenizer, text_to_word_sequence
from keras import backend as K
from sklearn.preprocessing import LabelBinarizer
from random import shuffle
from tqdm import trange
import numpy as np
import json
import h5py
import csv
import re
import cyrtranslit
from string import punctuation
import json
import random


def textgenrnn_sample(preds, temperature, interactive=False, top_n=3):
    '''
    Samples predicted probabilities of the next character to allow
    for the network to show "creativity."
    '''

    preds = np.asarray(preds).astype('float64')

    if temperature is None or temperature == 0.0:
        return np.argmax(preds)

    preds = np.log(preds + K.epsilon()) / temperature
    exp_preds = np.exp(preds)
    preds = exp_preds / np.sum(exp_preds)
    probas = np.random.multinomial(1, preds, 1)

    if not interactive:
        index = np.argmax(probas)

        # prevent function from being able to choose 0 (placeholder)
        # choose 2nd best index from preds
        if index == 0:
            index = np.argsort(preds)[-2]
    else:
        # return list of top N chars/words
        # descending order, based on probability
        index = (-preds).argsort()[:top_n]

    return index

def generate_random_start_text(model, vocab,
                                indices_char, temperature=0.5,
                                maxlen=40, meta_token='<s>',
                                word_level=False,
                                single_text=False,
                                max_gen_length=300,
                                interactive=False):

    text = ['']
    puncts = '''!()-[]{};:'"\,<>./?@#$%^&*_~'''
    max_gen_length += maxlen

    if not isinstance(temperature, list):
        temperature = [temperature]
    if len(model.inputs) > 1:
        model = Model(inputs=model.inputs[0], outputs=model.outputs[1])

    #iterations = random.randrange(41, 500, 1)
    iterations = 100

    for i in range(iterations):

        encoded_text = textgenrnn_encode_sequence(text[-maxlen:], vocab, maxlen)
        next_temperature = temperature[(len(text) - 1) % len(temperature)]

        def get_options(n_branches=1):

            options_index = textgenrnn_sample(
                model.predict(encoded_text, batch_size=1)[0],
                next_temperature, interactive=interactive,
                top_n=n_branches
            )
            options = [indices_char[idx] for idx in options_index]
            return options

        options = get_options()

        for option in options:
            if text[-1]:
                prev_option = text[-1]
            else:
                prev_option = " "

            prev_is_punct = prev_option[0] in puncts
            both_are_punct = prev_is_punct and option[0] in puncts

            if (prev_option == option) or both_are_punct:
                new_options = get_options(10)
                for new_option in new_options:
                    both_are_punct_again = prev_is_punct and new_option[0] in puncts
                    if (prev_option != new_option) and not both_are_punct_again:
                        option = new_option
                        break

            text = text + [option]

    # print(text)
    # print(len(text))

    return text

def textgenrnn_generate_special(model, vocab,
                                indices_char, temperature=0.5,
                                maxlen=40, meta_token='<s>',
                                word_level=False,
                                single_text=False,
                                max_gen_length=300,
                                interactive=False,
                                top_n=3,
                                prefix=None,
                                synthesize=False,
                                input_text=None,
                                input_depth=6):
    if input_text is None:
        input_text = ['']

    collapse_char = ' ' if word_level else ''
    end = False

    text = input_text

    puncts = '''!()-[]{};:'"\,<>./?@#$%^&*_~'''

    max_gen_length += maxlen

    if not isinstance(temperature, list):
        temperature = [temperature]
    if len(model.inputs) > 1:
        model = Model(inputs=model.inputs[0], outputs=model.outputs[1])

    max_depth = input_depth

    def branching(text, plant, depth=0):

        depth += 1
        if depth == max_depth:
            return

        encoded_text = textgenrnn_encode_sequence(text[-maxlen:],
                                                  vocab, maxlen)
        next_temperature = temperature[(len(text) - 1) % len(temperature)]
        # n_branches = 1 if depth is 0 else 2
        n_branches = 2

        def get_options(n_branches=n_branches):

            options_index = textgenrnn_sample(
                model.predict(encoded_text, batch_size=1)[0],
                next_temperature,
                interactive=interactive,
                # top_n=random.randint(2,5)
                # top_n=2
                top_n=n_branches
            )
            options = [indices_char[idx] for idx in options_index]
            # filter punctuations
            options = list(filter(lambda o: o not in puncts, options))
            return options

        options = get_options(10)
        options = options[:2]

        print("start")
        for index, option in enumerate(options):
            print(index)

            # if text[-1]:
            #     prev_option = text[-1]
            # else:
            #     prev_option = " "
            #
            # prev_is_punct = prev_option[0] in puncts
            # both_are_punct = prev_is_punct and option[0] in puncts
            #
            # if (prev_option == option) or both_are_punct:
            #     new_options = get_options(10)
            #     for new_option in new_options:
            #         both_are_punct_again = prev_is_punct and new_option[0] in puncts
            #         if (prev_option != new_option) and not both_are_punct_again:
            #             option = new_option
            #             break

            item_text = text + [option]

            cyr_option = cyrtranslit.to_cyrillic(option)
            node_object = {"name": cyr_option,
                           "children": []}
            plant.append(node_object)
            branching(item_text, plant=node_object["children"], depth=depth)

        return plant

    plt = branching(text=text, plant=[])
    # print(json.dumps(plt))
    return_value = {"name": cyrtranslit.to_cyrillic(text[-1]),
                    "children": plt}

    return return_value, end


def textgenrnn_generate(model, vocab,
                        indices_char, temperature=0.5,
                        maxlen=40, meta_token='<s>',
                        word_level=False,
                        single_text=False,
                        max_gen_length=300,
                        interactive=False,
                        top_n=3,
                        prefix=None,
                        synthesize=False,
                        stop_tokens=[' ', '\n']):
    '''
    Generates and returns a single text.
    '''

    collapse_char = ' ' if word_level else ''
    end = False

    if single_text:
        text = prefix_t if prefix else ['']
        max_gen_length += maxlen
    else:
        text = [meta_token] + prefix_t if prefix else [meta_token]

    # If generating word level, must add spaces around each punctuation.
    # https://stackoverflow.com/a/3645946/9314418
    if word_level and prefix:
        punct = '!"#$%&()*+,-./:;<=>?@[\]^_`{|}~\\n\\t\'‘’“”’–—'
        prefix = re.sub('([{}])'.format(punct), r' \1 ', prefix)
        prefix_t = [x.lower() for x in prefix.split()]

    if not word_level and prefix:
        prefix_t = list(prefix)

    if single_text:
        text = prefix_t if prefix else ['']
        max_gen_length += maxlen
    else:
        text = [meta_token] + prefix_t if prefix else [meta_token]

    next_char = ''

    if not isinstance(temperature, list):
        temperature = [temperature]

    if len(model.inputs) > 1:
        model = Model(inputs=model.inputs[0], outputs=model.outputs[1])

    while not end and len(text) < max_gen_length:
        encoded_text = textgenrnn_encode_sequence(text[-maxlen:],
                                                  vocab, maxlen)
        next_temperature = temperature[(len(text) - 1) % len(temperature)]

        if not interactive:
            # auto-generate text without user intervention
            next_index = textgenrnn_sample(
                model.predict(encoded_text, batch_size=1)[0],
                next_temperature)
            next_char = indices_char[next_index]
            text += [next_char]
            if next_char == meta_token or len(text) >= max_gen_length:
                end = True
            gen_break = (next_char in stop_tokens or word_level or
                         len(stop_tokens) == 0)
            if synthesize and gen_break:
                break
        else:
            print(text)
            # ask user what the next char/word should be
            options_index = textgenrnn_sample(
                model.predict(encoded_text, batch_size=1)[0],
                next_temperature,
                interactive=interactive,
                top_n=top_n
            )
            options = [indices_char[idx] for idx in options_index]
            print('Controls:\n\ts: stop.\tx: backspace.\to: write your own.')
            print('\nOptions:')

            for i, option in enumerate(options, 1):
                print('\t{}: {}'.format(i, option))

            print('\nProgress: {}'.format(collapse_char.join(text)[3:]))
            print('\nYour choice?')
            user_input = input('> ')

            try:
                user_input = int(user_input)
                next_char = options[user_input - 1]
                text += [next_char]
            except ValueError:
                if user_input == 's':
                    next_char = '<s>'
                    text += [next_char]
                elif user_input == 'o':
                    other = input('> ')
                    text += [other]
                elif user_input == 'x':
                    try:
                        del text[-1]
                    except IndexError:
                        pass
                else:
                    print('That\'s not an option!')

    # if single text, ignore sequences generated w/ padding
    # if not single text, remove the <s> meta_tokens
    if single_text:
        text = text[maxlen:]
    else:
        text = text[1:]
        if meta_token in text:
            text.remove(meta_token)

    text_joined = collapse_char.join(text)

    # If word level, remove spaces around punctuation for cleanliness.
    if word_level:
        #     left_punct = "!%),.:;?@]_}\\n\\t'"
        #     right_punct = "$([_\\n\\t'"
        punct = '\\n\\t'
        text_joined = re.sub(" ([{}]) ".format(punct), r'\1', text_joined)
        #     text_joined = re.sub(" ([{}])".format(
        #       left_punct), r'\1', text_joined)
        #     text_joined = re.sub("([{}]) ".format(
        #       right_punct), r'\1', text_joined)

    return text_joined, end


def textgenrnn_encode_sequence(text, vocab, maxlen):
    '''
    Encodes a text into the corresponding encoding for prediction with
    the model.
    '''

    encoded = np.array([vocab.get(x, 0) for x in text])
    return sequence.pad_sequences([encoded], maxlen=maxlen)


def textgenrnn_texts_from_file(file_path, header=True,
                               delim='\n', is_csv=False):
    '''
    Retrieves texts from a newline-delimited file and returns as a list.
    '''

    with open(file_path, 'r', encoding='utf8', errors='ignore') as f:
        if header:
            f.readline()
        if is_csv:
            texts = []
            reader = csv.reader(f)
            for row in reader:
                texts.append(row[0])
        else:
            texts = [line.rstrip(delim) for line in f]

    return texts


def textgenrnn_texts_from_file_context(file_path, header=True):
    '''
    Retrieves texts+context from a two-column CSV.
    '''

    with open(file_path, 'r', encoding='utf8', errors='ignore') as f:
        if header:
            f.readline()
        texts = []
        context_labels = []
        reader = csv.reader(f)
        for row in reader:
            texts.append(row[0])
            context_labels.append(row[1])

    return (texts, context_labels)


def textgenrnn_encode_cat(chars, vocab):
    '''
    One-hot encodes values at given chars efficiently by preallocating
    a zeros matrix.
    '''

    a = np.float32(np.zeros((len(chars), len(vocab) + 1)))
    rows, cols = zip(*[(i, vocab.get(char, 0))
                       for i, char in enumerate(chars)])
    a[rows, cols] = 1
    return a


def synthesize(textgens, n=1, return_as_list=False, prefix='',
               temperature=[0.5, 0.2, 0.2], max_gen_length=300,
               progress=True, stop_tokens=[' ', '\n']):
    """Synthesizes texts using an ensemble of input models.
    """

    gen_texts = []
    iterable = trange(n) if progress and n > 1 else range(n)
    for _ in iterable:
        shuffle(textgens)
        gen_text = prefix
        end = False
        textgen_i = 0
        while not end:
            textgen = textgens[textgen_i % len(textgens)]
            gen_text, end = textgenrnn_generate(textgen.model,
                                                textgen.vocab,
                                                textgen.indices_char,
                                                temperature,
                                                textgen.config['max_length'],
                                                textgen.META_TOKEN,
                                                textgen.config['word_level'],
                                                textgen.config.get(
                                                    'single_text', False),
                                                max_gen_length,
                                                prefix=gen_text,
                                                synthesize=True,
                                                stop_tokens=stop_tokens)
            textgen_i += 1
        if not return_as_list:
            print("{}\n".format(gen_text))
        gen_texts.append(gen_text)
    if return_as_list:
        return gen_texts


def synthesize_to_file(textgens, destination_path, **kwargs):
    texts = synthesize(textgens, return_as_list=True, **kwargs)
    with open(destination_path, 'w') as f:
        for text in texts:
            f.write("{}\n".format(text))


class generate_after_epoch(Callback):
    def __init__(self, textgenrnn, gen_epochs, max_gen_length):
        self.textgenrnn = textgenrnn
        self.gen_epochs = gen_epochs
        self.max_gen_length = max_gen_length

    def on_epoch_end(self, epoch, logs={}):
        if self.gen_epochs > 0 and (epoch + 1) % self.gen_epochs == 0:
            self.textgenrnn.generate_samples(
                max_gen_length=self.max_gen_length)

class save_model_weights(Callback):
    def __init__(self, textgenrnn, num_epochs, save_epochs):
        self.textgenrnn = textgenrnn
        self.weights_name = textgenrnn.config['name']
        self.num_epochs = num_epochs
        self.save_epochs = save_epochs

    def on_epoch_end(self, epoch, logs={}):
        if len(self.textgenrnn.model.inputs) > 1:
            self.textgenrnn.model = Model(inputs=self.model.input[0],
                                          outputs=self.model.output[1])
        if self.save_epochs > 0 and (epoch + 1) % self.save_epochs == 0 and self.num_epochs != (epoch + 1):
            print("Saving Model Weights — Epoch #{}".format(epoch + 1))
            self.textgenrnn.model.save_weights(
                "{}_weights_epoch_{}.hdf5".format(self.weights_name, epoch + 1))
        else:
            self.textgenrnn.model.save_weights(
                "{}_weights.hdf5".format(self.weights_name))
