function detectTheme(){
    var toggler, animate;
    if(document.getElementById('mySidenav').style.visibility=="visible"){
        toggler = document.getElementById('theme-toggler1')
        animate = document.getElementById('animate1')
    }
    else{
       toggler = document.getElementById('theme-toggler')
       animate = document.getElementById('animate')
    }

    document.body.addEventListener('paste', handlePaste);
    if (window.matchMedia) {
      const sun = 'fa-sun';
      const moon ='fa-moon';
      const wrapper = document.getElementsByClassName("Wrapper");
      var body=document.body;
      
      if(!window.matchMedia('(prefers-color-scheme: dark)').matches || localStorage.getItem("theme")=="light"){
        setParticles("#560466",["#55d51c", "#5199e3", "#0ea351"], localStorage.getItem("animate")=="spin");
        body.classList.toggle("dark-mode");
        toggler.classList.toggle(sun);
        toggler.classList.toggle(moon);
        if(wrapper.length!=0){wrapper[0].style.backgroundColor="rgba(65, 56, 56, 0.7)";}
        localStorage.setItem("theme", "light");
      }
      else{
        setParticles("#4bfa00",["#ab0bd3", "#cf18fd", "#ef3aff"], localStorage.getItem("animate")=="spin");
        localStorage.setItem("theme", "dark");
      }

    }
    const spin = 'fa-spin';
    if(localStorage.getItem("animate")=="stop"){
      animate.classList.remove(spin);
    }
    localStorage.setItem("LineArt", "false");
    setupfont();
}

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
    u8arr[n] = bstr.charCodeAt(n);
    }
  return new File([u8arr], filename, );
}

function rgb_lrgb1(v) {
    return (v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

function lrgb_rgb1(v) {
  return (v <= 0.0031308 ? 12.92 * v : 1.055 * (v ** (1 / 2.4)) - 0.055) * 255;
}

function LineArtIt() {
    var myDiv = document.getElementById('gallery'); 
    var img = myDiv.children[0]; 
    if(img===undefined){
        alert("Please Upload An Image.")
    }
    else if(localStorage.getItem("LineArt")=="true"){
        alert("Best Results Are Obtained From A Single Press.")
    }
    else{
        let Kx = [-1, 0, +1, -2, 0, +2, -1, 0, +1];
        let Ky = [-1, -2, -1, 0, 0, 0, +1, +2, +1]
        let width = img.naturalWidth;
        let height = img.naturalHeight;
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.width=width;
        canvas.height=height;
        context.drawImage(img, 0, 0, width, height);
        kr = 0.2126; kg = 0.7152; kb = 0.0722;
        let input = context.getImageData(0, 0, width, height);
        const output = context.createImageData(width, height);

        for (let y = 0, i = 0; y < height; ++y) {
            for (let x = 0; x < width; ++x, i += 4) {
                const r = rgb_lrgb1(input.data[i + 0]);
                const g = rgb_lrgb1(input.data[i + 1]);
                const b = rgb_lrgb1(input.data[i + 2]);
                const a = lrgb_rgb1(kr * r + kg * g + kb * b);
                output.data[i + 0] = 
                output.data[i + 1] = 
                output.data[i + 2] = a/8;
                output.data[i + 3] = 255;
            }
        } 
        context.putImageData(output, 0, 0);

        input = context.getImageData(0, 0, width, height);
        for (let y = 1, i = (width + 1) * 4; y < height - 1; ++y, i += 8) {
            for (let x = 1; x < width - 1; ++x, i += 4) {
            let rx = 0, ry = 0;
            let gx = 0, gy = 0;
            let bx = 0, by = 0;
            for (let yk = y - 1, j = 0; yk <= y + 1; ++yk) {
                for (let xk = x - 1; xk <= x + 1; ++xk, ++j) {
                    let i = (yk * width + xk) << 2;
                    rx += input.data[i + 0] * Kx[j];
                    ry += input.data[i + 0] * Ky[j];
                    gx += input.data[i + 1] * Kx[j];
                    gy += input.data[i + 1] * Ky[j];
                    bx += input.data[i + 2] * Kx[j];
                    by += input.data[i + 2] * Ky[j];
                }
            }
            output.data[i + 0] = (Math.hypot(rx, ry));
            output.data[i + 1] = (Math.hypot(gx, gy));
            output.data[i + 2] = (Math.hypot(bx, by));
            output.data[i + 3] = 255;
            }
            context.putImageData(output, 0, 0, 0, y, width, 1);
        }
        let data=output.data;
        for(let i = 0; i < data.length; i += 4) {
            output.data[i] =     (255 - data[i]) / 1.1;
            output.data[i + 1] = (255 - data[i + 1]) / 1.1;
            output.data[i + 2] = (255 - data[i + 2]) / 1.1;
            output.data[i + 3] = data[i + 3];
        }
        
        context.putImageData(output, 0, 0);
        var base64URI = canvas.toDataURL();
        img.src = base64URI;

        let reader = new FileReader();
        var newImage=dataURLtoFile(base64URI,"file1.png")

        var file = document.getElementById('fileElem');
        const dataTransfer = new DataTransfer();

        dataTransfer.items.add(newImage);
        file.files = dataTransfer.files;
        localStorage.setItem("LineArt", "true");
    }
}

function prepHref() { 
    var myDiv = document.getElementById('gallery-out'); 
    var myImage = myDiv.children[0]; 
    if(myImage!==undefined){
        let source=myImage.src;
        const fileName = source.split('/').pop();
        var el = document.createElement("a");
        el.setAttribute("href", source);
        el.setAttribute("download", fileName);
        document.body.appendChild(el);
        el.click();
        el.remove();
    }
    else{
        return;
    }
} 

const sun = 'fa-sun';
const moon ='fa-moon';
const spin = 'fa-spin';

function toggler(){
    var toggler, animate;
    if(document.getElementById('mySidenav').style.visibility=="visible"){
        toggler = document.getElementById('theme-toggler1')
        animate = document.getElementById('animate1')
    }
    else{
       toggler = document.getElementById('theme-toggler')
       animate = document.getElementById('animate')
    }
    const body=document.body;
    const wrapper = document.getElementsByClassName("Wrapper");
    if(toggler.classList.contains(sun)){
        setParticles("#560466",["#55d51c", "#5199e3", "#0ea351"], animate.classList.contains(spin));
        if(wrapper.length!=0){wrapper[0].style.backgroundColor="rgba(65, 56, 56, 0.7)";}
        localStorage.setItem("theme", "light");
    }
    else{
        setParticles("#4bfa00",["#ab0bd3", "#cf18fd", "#ef3aff"], animate.classList.contains(spin));
        if(wrapper.length!=0){wrapper[0].style.backgroundColor="rgba(221, 209, 209, 0.5)";}
        localStorage.setItem("theme", "dark");
    }
    toggler.classList.toggle(sun);
    toggler.classList.toggle(moon);
    body.classList.toggle("dark-mode");
}

function Animate(){
    var animate;
    if(document.getElementById('mySidenav').style.visibility=="visible"){
        animate = document.getElementById('animate1')
    }
    else{
       animate = document.getElementById('animate')
    }
    const particles = tsParticles.domItem(0);
    const options = particles.options;
    if(animate.classList.contains(spin)){
        localStorage.setItem("animate", "stop");
        animate.classList.remove(spin);
        options.particles.move.enable = false;
    }
    else{
        localStorage.setItem("animate", "spin");
        animate.classList.add(spin);
        options.particles.move.enable = true;
        particles.refresh();
    }
}

function setParticles(color, colorArr,flag){
  const particles = tsParticles.domItem(0);
  const options = particles.options;
  options.particles.color.value = colorArr;
  options.particles.links.color = color;
  options.particles.move.enable = flag;
  particles.refresh();
}

function setupfont(){
    const particles = tsParticles.domItem(0);
    particles.refresh();
    const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if(width<1024&&width>800){
        document.body.style.setProperty("font-size","2vw");
        document.getElementById("mySidenavBtn").style.visibility = "hidden";
        document.getElementById("mySidenavBtn").style.color = "var(--solid-white)";
        document.getElementById("mySidenav").style.visibility = "hidden";
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("MyNav").style.visibility = "visible";
    }
    else if(width<800&&width>500){
        document.body.style.setProperty("font-size","3vw");
        document.getElementById("mySidenavBtn").style.visibility = "visible";
        document.getElementById("mySidenavBtn").style.color = "var(--solid-black)";
        document.getElementById("mySidenav").style.visibility = "hidden";
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("MyNav").style.visibility = "hidden";
    }
    else if(width<500&&width>350){
        document.body.style.setProperty("font-size","4vw");
        document.getElementById("mySidenavBtn").style.visibility = "visible";
        document.getElementById("mySidenavBtn").style.color = "var(--solid-black)";
        document.getElementById("mySidenav").style.visibility = "hidden";
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("MyNav").style.visibility = "hidden";
    }
    else{
        document.body.style.setProperty("font-size","1.5vw");
        document.getElementById("mySidenavBtn").style.visibility = "hidden";
        document.getElementById("mySidenavBtn").style.color = "var(--solid-white)";
        document.getElementById("mySidenav").style.visibility = "hidden";
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("MyNav").style.visibility = "visible";
    }
}

function handlePaste(e) {
    var clipboardData;
  
    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();
    
    // Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData;
    var items = clipboardData.items;
    var blob;
    for (var i = 0; i < items.length; i++) {
        // Skip content if not image
        if (items[i].type.indexOf("image") == -1) continue;
        // Retrieve image on clipboard as blob
        var blob = items[i].getAsFile();
    }
  
    previewFile(blob);
}

function handleFiles(files) {
    files = [...files]
    uploadFile(files[0])
    previewFile(files[0])
    files=[];
}

function uploadFile(file) {
    let url = 'YOUR URL HERE'
    let formData = new FormData()
    formData.append('file', file)
}

function previewFile(file) {
  const acceptedImageTypes = ['image/jpg','image/jpeg', 'image/png'];   
  if(file && acceptedImageTypes.includes(file['type'])){
    let imgs= document.getElementById('gallery');
    imgs.innerHTML = '';
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function() {
        let img = document.createElement('img')
        img.setAttribute('id', 'INPUT');//This Is where we create the input image in the html with id=INPUT
        img.src = reader.result
        imgs.appendChild(img)
    }
    localStorage.setItem("LineArt", "false");
  }   
  else{
    alert("Please Upload An Image Of Type JPG,JPEG Or PNG");
  }  
}

function CloseSample(){
    const gallery = document.getElementById('gallery-Wrapper');
    gallery.style.setProperty("visibility","");
    gallery.style.setProperty("z-index","-1");
}
function OpenSample(){
    const gallery = document.getElementById('gallery-Wrapper');
    gallery.style.setProperty("visibility","visible");
    gallery.style.setProperty("z-index","2");
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL();
}

function Select(element){

    base64URI=getBase64Image(element);
    var newImage=dataURLtoFile(base64URI,"file1.png")
    var file = document.getElementById('fileElem');

    const dataTransfer = new DataTransfer();

    dataTransfer.items.add(newImage);
    file.files = dataTransfer.files;

    let imgs= document.getElementById('gallery');
    imgs.innerHTML = '';
    let img = document.createElement('img')
    img.setAttribute('id', 'INPUT');//This Is where we create the input image in the html with id=INPUT
    img.src = element.src;
    imgs.appendChild(img)
    localStorage.setItem("LineArt", "true");
    CloseSample();
}

function openNav() {
    if( document.getElementById("mySidenav").style.visibility == "visible"){
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("mySidenav").style.visibility = "hidden";
        document.getElementById("mySidenavBtn").style.color = "var(--solid-black)";

    }
    else {
        document.getElementById("mySidenav").style.width = "50vw";
        document.getElementById("mySidenav").style.visibility = "visible";
        document.getElementById("mySidenavBtn").style.color = "var(--solid-white)";
    }
}