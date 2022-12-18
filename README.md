# Lawnly
We tried in this model to colorize anime arts, It's already known that colorizing the line art, and choosing appropriate colors for the image; that represents the true story of the image is a very hard task and might take several hours, and maybe days; additionally, it requires professional artists. That's why we worked on a training deep learning model; that can learn the color palette for the image, and colorize appropriately in a matter of seconds, with no human help. Our model competes with the state-of-the-art models published in many papers. We proudly published our model online for any usage -Even commercially- with no penalty, but using our website might be limited only. 


<img width="1429" alt="Screenshot 2022-12-18 at 8 22 52 AM" src="https://user-images.githubusercontent.com/69484554/208284609-6d2d3edb-ff46-49eb-a25c-0d5656d1b6b8.png">


# model
Our model is based on a U-NET network; however, it's a bit modified from the original one, by utilizing a swish layer, which was firstly published by Ru-Ting Ye (Ye et al., 2019) We didn't use GAN for image generation training; although, we used VGG19 as visual perceptron, and used them in some way as a loss function; it generated great results, better than what we got after training GAN. 

# loss function

<img width="1019" alt="Screenshot 2022-12-18 at 8 23 40 AM" src="https://user-images.githubusercontent.com/69484554/208284639-15608920-adb0-4bac-8c97-8089fa3d1a4d.png">


for more information, please read the [following](https://lawnlyanimecolorization.azurewebsites.net/model)

# Language, and libs
1. PyTorch (python) for model trainging
2. HTML, css, and JS(front end web)
3. flask (backend)
