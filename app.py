from __future__ import print_function # In python 2.7
from flask import Flask, request, render_template, redirect, flash, send_from_directory, url_for
import pickle
from model.prediction import colorize_img,colorize_button_clicked
from flask_uploads  import UploadSet, IMAGES, configure_uploads
from flask_wtf import FlaskForm
from wtforms import SubmitField
from flask_wtf import FlaskForm
from wtforms import FileField, SubmitField
from werkzeug.utils import secure_filename
import os
from wtforms.validators import InputRequired
import uuid
import sys

app = Flask(__name__,template_folder='templates')

# Loading the model
#print(get_prediction().size())

app.config['SECRET_KEY'] = 'supersecretkey'
#app.config['UPLOAD_FOLDER'] = r'static\uploaded_images'
app.config['UPLOAD_FOLDER'] = r'static'


class UploadFileForm(FlaskForm):
    style_upload={'style':
                  'padding 5px; vertical-align: top; align-content: center; width:50%; width:200px; height:70px; margin-top:5%; cursor:pointer; font-size:larger; font-weight: 900; border-radius: 10px; border: 2px solid #55d51c;'}
    style_file={'style':
                  'padding 5px; vertical-align: top; align-content: center; width:50%; width:300px; height:70px; margin-top:5%; cursor:pointer; font-size:larger; font-weight: 900; border-radius: 10px; border: 2px solid #55d51c;'}
    
    file = FileField("File", validators=[InputRequired()], render_kw=style_file)
    submit = SubmitField("Upload Image",render_kw=style_upload)



@app.route('/', methods=['GET',"POST"])
@app.route('/home', methods=['GET',"POST"])
def index():
    form = UploadFileForm()
    if form.validate_on_submit():
        file = form.file.data # First grab the file
        filename_unq = str(uuid.uuid4())
        filename_unq = str(filename_unq+"_"+file.filename)
        file_full_name = "{}\{}\{}".format(os.path.abspath(os.path.dirname(__file__)),app.config['UPLOAD_FOLDER'],secure_filename(str(filename_unq)))
        file.save(file_full_name) # Then save the file
        colorize_img(file_full_name)
        gen_file_path = filename_unq.replace(".","_gen.")
        return render_template('index_uploaded.html', form=form, gray_val=filename_unq,gen_val=gen_file_path)
    return render_template('index.html', form=form)

@app.route('/model', methods=['GET', 'POST'])
def about_model():
    return render_template("model.html")


@app.route('/about_us', methods=['GET', 'POST'])
def about_us():
    return render_template("about_us.html")



if __name__=='__main__':
    app.run()

