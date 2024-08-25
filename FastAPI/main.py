from fastapi import FastAPI, File, UploadFile, Response
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import base64

app = FastAPI()

origins = [
    "http://localhost",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL = tf.keras.layers.TFSMLayer("Model_Main/3", call_endpoint='serving_default')

CLASS_NAMES = ["glioma_tumor", "meningioma_tumor", "no_tumor", "pituitary_tumor"]

@app.get("/ping")
async def ping():
    return "Hello, I am alive"

def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)).convert('RGB'))
    return image

@app.post("/predict")
async def predict(
        file: UploadFile = File(...)
):
    image_data = await file.read()
    image = read_file_as_image(image_data)
    img_batch = np.expand_dims(image, 0)

    # Call the model directly on the input data
    predictions = MODEL(img_batch)

    # Convert the tensor to a numpy array
    predictions_array = predictions['output_0'].numpy()

    predicted_class = CLASS_NAMES[np.argmax(predictions_array[0])]
    confidence = np.max(predictions_array[0])

    # Convert image data to base64
    base64_image = base64.b64encode(image_data).decode('utf-8')

    return {
        'class': predicted_class,
        'confidence': float(confidence),
        'image': base64_image
    }

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)
