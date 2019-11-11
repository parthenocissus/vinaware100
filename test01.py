from textgenrnn import textgenrnn
import json
import random
import cyrtranslit

textgen = textgenrnn(weights_path='model/vinaware1_weights.hdf5',
                       vocab_path='model/vinaware1_vocab.json',
                       config_path='model/vinaware1_config.json')

textgen = textgenrnn(weights_path='model/vinaware2_weights.hdf5',
                       vocab_path='model/vinaware2_vocab.json',
                       config_path='model/vinaware2_config.json')

# input_words = ['']
input_words = textgen.generate_random_start(temperature=[0.5],
                                           max_gen_length=1,
                                           interactive=True)

print(input_words)
input_words = [cyrtranslit.to_cyrillic(word) for word in input_words]
print(input_words)
input_words = [cyrtranslit.to_latin(word) for word in input_words]
print(input_words)

generated_text = textgen.generate_special(temperature=[0.9],
                                          max_gen_length=1,
                                          interactive=True,
                                          top_n=2,
                                          input_text=input_words,
                                          input_depth=6)
j = json.dumps(generated_text)
print(j)