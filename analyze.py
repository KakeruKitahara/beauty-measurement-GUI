import json
from glob import glob


def expectationByType(data):  # モーフィングごとの点数の期待値
    expectation = {'liner': 0, 'stylegan': 0, 'semanticstylegan': 0, }
    step_sum = 0
    for v in data.values():
        for e in v['results']:
            expectation[e['type']] += e['ans']
        step_sum += len(v['results'])

    expectation = { k : v / (step_sum / len(expectation)) for k, v in expectation.items()}

    print(expectation)


base_path = 'results/*.json'
paths = glob(base_path)
data = {}
for p in paths:
    json_open = open(p, 'r')
    json_data = json.load(json_open)
    data[json_data['profile']['name']] = {
        'sex': json_data['profile']['name'], 'results': json_data['results']}

expectationByType(data)
