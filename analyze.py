import json
from glob import glob
from matplotlib import pyplot as plt
import math
import statistics as stcs
import numpy as np
import scipy as sp
import scipy.stats as stats


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
            values_median[kt][kf] = stcs.median(vf)

    lst = {'mean' : values_mean, 'median' :values_median}
    for i in lst.keys() :
        for s in ['liner', 'stylegan']:
            print(f'- {i}')
            diff = {}
            for k in lst[i][next(iter(lst[i]))]:
                diff[k] = lst[i]['semanticstylegan'][k] - lst[i][s][k]
            diff = sorted(diff.items(), key=lambda x: x[1])

            cnt = 0
            print(f'    - diff {s}')
            for k, v in diff :
                if v < 0 :
                    print(f'        *{k}', v, sep=' : ')
                else :
                    print(f'        {k}', v, sep=' : ')
                    cnt += 1
            print(f'        改善された表情数 : {cnt}/{len(diff)} {math.floor(cnt/len(diff) * 100)}%')


def diffReverseAspect(data, types) :
    expectation = totallng(data, types)
    expectation2 = {t : {f :[] for f in types['morphing']} for t in types['technique'] }
    types_st_morphing = []
    for vs in expectation.values() :
        for kt, vt in vs.items() :
            for kf, vf in vt.items() :
                expectation2[kt][kf].extend(vf)
                for sm in ['AN-', 'FE-', 'SA-']:  # 顔始点はAN, FE, SA
                    if sm in kf:
                        types_st_morphing.append(kf)
                    break

    values_mean = {t : {f : 0 for f in types['morphing']} for t in types['technique']}
    values_median = {t : {f : 0 for f in types['morphing']} for t in types['technique']}

    for kt, vt in expectation2.items() :
        for kf, vf in vt.items() :
            values_mean[kt][kf] = stcs.mean(vf)
            values_median[kt][kf] = stcs.median(vf)
    
    values_pair = {t : [{f : 0 for f in types_st_morphing}] * 2 for t in types['technique']}
    for kt, vt in values_pair.items() :
        for i, vi in enumerate(vt) :
            for kf in vi.keys() :
                if i == 0 :
                    values_pair[kt][i][kf]  = values_mean[kt][kf]
                else :
                    a, b = kf.split('-')
                    rkey = f'{b}-{a}'
                    values_pair[kt][i][kf]  = values_mean[kt][rkey]
    totoal_width = 0.8

    morph_graph_style()
    plt.title('reverse morphing', fontsize=20)
    for kt, vt in values_pair.items() :
        for i, ex in enumerate(vt):
            pos = np.arange(len(ex[1])) - totoal_width * \
                (1 - (2*i+1)/len(values_pair.values()))/2
            plt.bar(pos, ex[1].values(), width=totoal_width /
                    len(values_pair.values()), label=ex[0])
    plt.legend()
    plt.xticks(np.arange(len(values_pair[next(
        iter(values_pair))])), values_mean[next(iter(values_pair))].keys())
    plt.savefig(f'pdf/reverse-morphing.pdf')


    

def tatisticalTest(data, types) :
    def p_show(p) :
        if p < 0.05 :
            print('     - significance level : モーフィング間は有意である．')
        else :
            print('     - significance level : モーフィング間は有意があるか分からない．')

    expectation = totallng(data, types)
    all_ans = {t : [] for t in types['technique']}
    for vs in expectation.values() :
        for kt, vt in vs.items() :
            for vf in vt.values() :
                all_ans[kt].extend(vf)
    
    result = stats.mstats.kruskal(all_ans['liner'] , all_ans['stylegan'], all_ans['semanticstylegan'])
    print(f'- クラスカル = ウォリス検定')
    print(f'    - 統計量H : {result.statistic}, p値 : {result.pvalue}')
    p_show(result.pvalue)

    for s in ['stylegan', 'liner']: 
        result=stats.mannwhitneyu(all_ans['semanticstylegan'], all_ans[s]) # 片側検定でも良い．
        print(f'- マンホイットニーのU検定 semanticstylegan-{s}')
        print(f'    - 統計量U : {result.statistic}, p値 : {result.pvalue}')
        p_show(result.pvalue)



def commentPickup(data, types) :
    comments = {t : {f : [] for f in types['morphing']} for t in types['technique'] }
    for k, v in data.items():
        for e in v['results']:
            if e['comment'] != "" :
                comments[e['type']][e['name']].append((v['sex'], k, e['comment']))
    
    
    for kt, vt in comments.items() :
        cnt = 0
        print(f'- {kt}')
        for kf, vf in vt.items() :
            if len(vf) != 0 :
                print(f'    - {kf}')
                for v in vf :
                    print(f'         {v[0]}, {v[1]} : {v[2]}')
                    cnt += 1
        print(f'        コメント数 : {cnt}')


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
diffReverseAspect(data, types)
