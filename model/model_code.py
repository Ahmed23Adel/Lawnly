# -*- coding: utf-8 -*-
"""
Created on Tue Sep 13 00:59:45 2022

@author: desgr
"""
import torch.nn as nn
import torch

class SwishLayer(nn.Module):
  def __init__(self,channels):
    """
      The input and output channels must be equal
    """
    super(SwishLayer,self).__init__();
    self.conv = nn.Conv2d(channels,channels,kernel_size=3,stride=1,padding=1,bias = False)
    self.sig = nn.Sigmoid()

  def forward(self,x):
    return x
    hx = self.conv(x)
    hx = self.sig(hx)
    sx = hx * x
    return sx

from torch.nn.modules.batchnorm import BatchNorm1d
class DoubleConv(nn.Module):
  def __init__(self,in_c,out_c):
      super(DoubleConv,self).__init__();
      self.in_c = in_c;
      self.out_c = out_c
      self.conv = nn.Sequential(
          nn.Conv2d(in_c, out_c,kernel_size=3,stride=1,padding=1,bias = False),
          nn.BatchNorm2d(out_c),
          nn.LeakyReLU(inplace=True), # Some minor change
          nn.Conv2d(out_c, out_c,kernel_size=3,stride=1,padding=1,bias = False),
          nn.BatchNorm2d(out_c),
          nn.LeakyReLU(inplace=True), # Some minor change
      );

  def forward(self,x):
    return self.conv(x)



class UnetSGB(nn.Module):
  def __init__(self,
               in_c = 3,
               out_c=3,
               features = [64,128,256,512]): # 3-64  64-128  128-256  256-512
      super(UnetSGB,self).__init__();
      self.ups = nn.ModuleList()
      self.downs = nn.ModuleList()
      self.pool = nn.MaxPool2d(kernel_size=2,stride = 2)
      self.drpot = nn.Dropout(p = 0.2)
      ##Down part
      for feature in features:
        self.downs.append(DoubleConv(in_c,feature))
        in_c = feature

      ## up part
      for feature in reversed(features):
        self.ups.append(
            nn.ConvTranspose2d(feature*2,feature, kernel_size=2,stride = 2)
            )
        self.ups.append(SwishLayer(feature))
        self.ups.append(DoubleConv(feature *2,feature))
        


      self.bottleneck = DoubleConv(features[-1],features[-1]*2)## how?
      self.final_col = nn.Conv2d(features[0],out_c,kernel_size = out_c,padding = 1)


  def forward(self,x):
    skip_connections=[]
    i = 0
    for down in self.downs:
#       print("x down",type(x),x)
      x = down(x)
      skip_connections.append(x)
      x = self.pool(x)
      if i%2 ==0:
          x = self.drpot(x)
      i +=1

    x = self.bottleneck(x)
    skip_connections = skip_connections[::-1]
    
    i = 0
    for idx in range(0,len(self.ups),3):
      x = self.ups[idx](x)
      #print(x.shape)
      skip_connection = skip_connections[idx//3]
      skip_connection = self.ups[idx+1](skip_connection)
      if i%3 ==0:
        skip_connection = self.drpot(skip_connection)
      i +=1
      concatenate_skip = torch.cat((skip_connection,x),dim = 1)

      x = self.ups[idx+2](concatenate_skip)
      #print(x.size())

    return self.final_col(x)



device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')
generator = UnetSGB()
generator.load_state_dict(torch.load('model/Lawnly.pt', map_location=device))
# Or you can move the loaded model into the specific device
generator.to(device)

