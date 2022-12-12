from glob import glob
import os
import json

path ="app/public/morphing/*"
class_paths = glob(path)

path_lists ={}

for p in class_paths :
  type = os.path.basename(p)
  path_lists[type] =  glob(f'{p}/*.mp4')

json_list=[]


for k in path_lists.keys() :
  cnt = 0
  for v in path_lists[k] :
    v = v.replace('app','..',1)
    morphing = {'type' : k, 'path' : v, 'no' : cnt}
    json_list.append(morphing)
    cnt += 1


with open('./app/src/path_txt.json', 'w') as f:
    json.dump(json_list, f, ensure_ascii=False, indent=2)
