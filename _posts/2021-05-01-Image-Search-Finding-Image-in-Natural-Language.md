---
title:  "Image Search — Finding Image in Natural Language"
date:   2021-05-01 08-00-00 
classes: wide
header:
  teaser: /assets/images/Image_Search/rainbow.png
permalink: "/Image-Search-In-NLP/"
excerpt: "Have you ever been in a situation where you had problem in finding a particular image from a large collection of images in your computer?"
---
Have you ever been in a situation where you had problem in finding a particular image from a large collection of images in your computer and you wished you could search it by describing the image in natural language. If yes, this article is for you. Here I am going to describe a project that I recently did to overcome this problem in searching an image.

**‘Image Search’** uses [CLIP](https://github.com/openai/CLIP) , an open-source multi-modality model by OpenAI that connects images and text in some way. To use this project, prior installation of conda is required. The installation files can be found [here](https://www.anaconda.com/products/individual). After installing anaconda, clone the [repository](https://github.com/samiptimalsena/Image-Search) and run the following commands:

```bash
$ cd Image-Search/script
$ ./install.sh 
$ python search.py
```

**Note**: *Replace cudatoolkit=11.0 in the install.sh with the appropriate CUDA version on your machine or cpuonly when installing on a machine without a GPU.*

You now see three images of green hills with its image name printed in the terminal. This is because the default search query is ‘Green hills’ and the default searching directory is image folder of the project. You can provide your own search query and searching directory by passing them as arguments. The CLI arguments available are:


| Arguments | Default | Description |
|:----------:|:---------:|-------------:|
| -p or --path | images/ | Path to Image Folder | 
| -q or --query | 'Green hills' | Search Query | 
| -c or --count | 3 | Number of images to return |

<br/>
Now if i run the following command, i see a beautiful image containing a rainbow.
```bash
$ python3 search.py -p ~/py_works/notebooks/images/ -q 'Rainbow' -c 1
```

![Rainbow](/assets/images/Image_Search/rainbow.png)

Change the searching query and searching directory and you probably find the image you want.

## Inspecting Search Script

After the required dependencies are installed using install.sh, you can run the searching script.

{% highlight python %}
# Search Script

import torch
import clip
from PIL import Image
import cv2
import os
import argparse

device = "cuda" if torch.cuda.is_available() else "cpu"

if device == "cuda":
    torch.cuda.empty_cache()
    
model, preprocess = clip.load("ViT-B/32", device=device)

parser = argparse.ArgumentParser(description='Image Search')
parser.add_argument('-p', '--path', type=str, default='images/', help='Path to Image folder')
parser.add_argument('-q', '--query', type=str, default='Green hills', help='Search Query')
parser.add_argument('-c', '--count', type=int, default=3, help='Number of images to return')

args = parser.parse_args()

images_path = None

def read_images(path):
    global images_path
    images_path = os.listdir(path)
    images = torch.empty((len(images_path),3,224,224))
    
    for i, img_path in enumerate(images_path):
        img = Image.open(path+img_path)
        images[i] = preprocess(img)
        
    images = images.to(device)
    return images

def tokenize_text(search_query):
    search_query = clip.tokenize(search_query).to(device)
    return search_query

def find_images(images, search_query, result_count):
    with torch.no_grad():
        img_probs, query_probs = model(images, search_query)
        idxs = (-query_probs).argsort().cpu().numpy()[0][:result_count]
    
    for idx in idxs:
        print(images_path[idx])
        img = cv2.imread(args.path+images_path[idx])
        img_resize = cv2.resize(img, (500,500))
        cv2.imshow(images_path[idx], img_resize)

    cv2.waitKey(0)
    cv2.destroyAllWindows()
    

images = read_images(args.path)
search_query = tokenize_text(args.query)

find_images(images, search_query, args.count)
{% endhighlight %}
<br/>
The code is simple. After the arguments have been parsed, we read all the images present in searching directory and preprocess it using the *preprocess()* of the CLIP model. The search query can also be tokenized in the similar way using *tokenize()*. For our purpose, we can simply pass the preprocessed batch of images and searched query to the model. The model returns the cosine similarities between the corresponding image and query, times 100. The values is then sorted in descending order and the requested number of corresponding image is displayed.

This way we can find our images searching it in our natural language. Though, the process is computationally expensive, it is sometime fun and useful. You can visit my [repo](https://github.com/samiptimalsena/Image-Search) and check the project.