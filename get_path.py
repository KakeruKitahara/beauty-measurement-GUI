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
  for v in path_lists[k] :
    v = v.replace('app/public/','',1)
    morphing = {'type' : k, 'path' : v, 'name' : os.path.splitext(os.path.basename(v))[0]}
    json_list.append(morphing)


with open('./app/src/path_txt.json', 'w') as f:
    json.dump(json_list, f, ensure_ascii=False, indent=2)
