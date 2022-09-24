# -*- coding: utf-8 -*-
"""
Created on Tue Sep 13 01:36:21 2022

@author: desgr
"""
from __future__ import print_function # In python 2.7
import torch
import torchvision.transforms as T
from PIL import Image
import torchvision.transforms.functional as TF
from model.model_code import generator
import sys

#Preprocessing of image.
IMAGE_SIZE = 256
BATCH_SIZE = 1
MEAN = torch.tensor([0.485, 0.456, 0.406])
STD = torch.tensor([0.229, 0.224, 0.225])
trans = T.Compose([
    T.Resize((IMAGE_SIZE,IMAGE_SIZE)),
    T.ToTensor(),
    T.Normalize(mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225],) 
])


def denorm(img_tensor):
  return img_tensor * STD[:, None, None] + MEAN[:, None, None]

from torchvision.utils import save_image
import os
sample_dir = './static'
def save_samples(fake_img, original_name):
    fake_name = str(os.path.basename(original_name))
    # print("sample_dir",sample_dir," fake_name",fake_name,"original_name",original_name,"basename", str(os.path.basename(original_name)),file=sys.stdout)
    save_image(denorm(fake_img), os.path.join(sample_dir, fake_name), nrow=8)
    
        
# predict
def colorize_img(file_path = "G:\Zc Things\Work\Anime Colorization\Lawnly\images\line_art.jpg"):
    #reading the image
    image = Image.open(file_path).convert('RGB')
    image = trans(image)
    image.unsqueeze_(0)    
    output = generator(image)
    file_path = file_path.replace(".","_gen.")
    save_samples(output,file_path)
    return file_path


def colorize_button_clicked():
    print("colorize")