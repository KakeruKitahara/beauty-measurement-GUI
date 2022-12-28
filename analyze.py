import json
from glob import glob
from matplotlib import pyplot as plt
import math
import statistics as stcs
import numpy as np
import scipy as sp
import scipy.stats
import pandas as pd


def morph_graph_style():
    plt.rcParams['axes.axisbelow'] = True
    plt.rcParams['figure.subplot.bottom'] = 0.2
    plt.figure(figsize=(30, 6))
    plt.ylim(0, 5)
    plt.grid(axis='y')
    plt.xticks(rotation=90)


def add_value_label(y_list, sft=0):
    for i, y in enumerate(y_list):
        j = math.floor(y * 100) / 100
        plt.text(i - sft, y+0.1, j, ha="center")


def totallng(data, types) :
    expectation = {s : {t : {f :[] for f in types['morphing']} for t in types['technique'] }for s in types['sex']}
    for v in data.values():
        for e in v['results']:
            expectation[v['sex']][e['type']][e['name']].append(e['ans'])
    return expectation

def averageByType(data, types):  # モーフィング種類
    expectation = totallng(data, types)
    all_ans = {s : {t : [] for t in types['technique']} for s in types['sex']}
    for ks, vs in expectation.items() :
        for kt, vt in vs.items() :
            for vf in vt.values() :
                all_ans[ks][kt].extend(vf)
    
    
    for ks, vs in all_ans.items() :
        print(f'- {ks}')
        for kt, vt in vs.items() :
            print(f'    - {kt}')
            print(f'        - mean : {stcs.mean(vt)}') 
            print(f'        - median : {stcs.median(vt)}') 

    all_ans = {t : [] for t in types['technique']}
    for vs in expectation.values() :
        for kt, vt in vs.items() :
            for vf in vt.values() :
                all_ans[kt].extend(vf)

    print(f'- 全体')
    for k, v in all_ans.items() :
        print(f'    - {k}')
        print(f'        - mean : {stcs.mean(v)}') 
        print(f'        - median : {stcs.median(v)}') 


def averageByAspect(data, types):  # 表情ごとの期待値
    expectation = totallng(data, types)
    expectation_sm = {t : {} for t in types['technique'] }
    types_st_morphing = []
    for vs in expectation.values() :
        for kt, vt in vs.items() :
            for kf, vf in vt.items() :
                for sm in ['AN-', 'FE-', 'SA-']:  # 顔始点はAN, FE, SA
                    if sm in kf:
                        if kf not in expectation_sm[kt]:
                            expectation_sm[kt][kf] = []
                            types_st_morphing.append(kf)
                        expectation_sm[kt][kf].extend(vf)
                        break
    values_mean = {t : {f : 0 for f in types_st_morphing} for t in types['technique']}
    values_median = {t : {f : 0 for f in types_st_morphing} for t in types['technique']}
    for kt, vt in expectation_sm.items() :
        for kf, vf in vt.items() :
            values_mean[kt][kf] = stcs.mean(vf)
        morph_graph_style()
        plt.title(f'{kt} (mean)', fontsize=20)
        add_value_label(list(values_mean[kt].values()))
        plt.bar(values_mean[kt].keys(), values_mean[kt].values())
        plt.savefig(f'pdf/{kt}-mean.pdf')
        plt.clf()

        for kf, vf in vt.items() :
            values_median[kt][kf] = stcs.median(vf)
        morph_graph_style()
        plt.title(f'{kt} (median)', fontsize=20)
        add_value_label(list(values_median[kt].values()))
        plt.bar(values_median[kt].keys(), values_median[kt].values())
        plt.savefig(f'pdf/{kt}-median.pdf')
        plt.clf()

    totoal_width = 0.8
    morph_graph_style()
    plt.title('enumerate morphing (mean)', fontsize=20)
    for i, ex in enumerate(values_mean.items()):
        pos = np.arange(len(ex[1])) - totoal_width * \
            (1 - (2*i+1)/len(values_mean.values()))/2
        plt.bar(pos, ex[1].values(), width=totoal_width /
                len(values_mean.values()), label=ex[0])
    plt.legend()
    plt.xticks(np.arange(len(values_mean[next(
        iter(values_mean))])), values_mean[next(iter(values_mean))].keys())
    plt.savefig(f'pdf/enumerate-mean.pdf')
    plt.clf()

    morph_graph_style()
    plt.title('enumerate morphing (median)', fontsize=20)
    for i, ex in enumerate(values_median.items()):
        pos = np.arange(len(ex[1])) - totoal_width * \
            (1 - (2*i+1)/len(values_median.values()))/2
        plt.bar(pos, ex[1].values(), width=totoal_width /
                len(values_median.values()), label=ex[0])
    plt.legend()
    plt.xticks(np.arange(len(values_median[next(
        iter(values_median))])), values_mean[next(iter(values_median))].keys())
    plt.savefig(f'pdf/enumerate-median.pdf')


def diffByAspect(data, types):  # semanticstyleganと他の実装の比較
    expectation = totallng(data, types)
    expectation_sm = {t : {} for t in types['technique'] }
    types_st_morphing = []
    for vs in expectation.values() :
        for kt, vt in vs.items() :
            for kf, vf in vt.items() :
                for sm in ['AN-', 'FE-', 'SA-']:  # 顔始点はAN, FE, SA
                    if sm in kf:
                        if kf not in expectation_sm[kt]:
                            expectation_sm[kt][kf] = []
                            types_st_morphing.append(kf)
                        expectation_sm[kt][kf].extend(vf)
                        break
    values_mean = {t : {f : 0 for f in types_st_morphing} for t in types['technique']}
    values_median = {t : {f : 0 for f in types_st_morphing} for t in types['technique']}
    for kt, vt in expectation_sm.items() :
        for kf, vf in vt.items() :
            values_mean[kt][kf] = stcs.mean(vf)

    for s in ['liner', 'stylegan']:
        diff = {}
        for k in values_mean[next(iter(values_mean))]:
            diff[k] = values_mean['semanticstylegan'][k] - values_mean[s][k]
        diff = sorted(diff.items(), key=lambda x: x[1])

        cnt = 0
        print(f'-- diff {s} --')
        for k, v in diff :
            if v < 0 :
                print(f'*{k}', v, sep=' : ')
            else :
                print(k, v, sep=' : ')
                cnt += 1
        print(f'改善された表情数 : {cnt}/{len(diff)} {math.floor(cnt/len(diff) * 100)}%')


def diffReverseAspect() :
    print('a')

def kai(data) :
    
    x2, p, dof, expected = sp.stats.chi2_contingency(crossed)

    print("カイ二乗値は %(x2)s" %locals() )
    print("確率は %(p)s" %locals() )
    print("自由度は %(dof)s" %locals() )
    print( expected )

    if p < 0.05:
        print("有意な差があります")
    else:
        print("有意な差がありません")

def commentPickup() :
    print('a')


base_path = 'results/*.json'
paths = glob(base_path)
data = {}
type_sex = set()
type_technique = set()
type_morphing = set()
for i, p in enumerate(paths):
    json_open = open(p, 'r')
    json_data = json.load(json_open)
    data[json_data['profile']['name']] = {
        'sex': json_data['profile']['sex'], 'results': json_data['results']}
    type_sex.add(json_data['profile']['sex'])
    if i == 0 :
        for d in json_data['results'] : 
            type_technique.add(d['type'])
            type_morphing.add(d['name'])
types = {'sex' : list(type_sex), 'technique' : list(type_technique), 'morphing' : list(type_morphing)}
diffByAspect(data, types)
