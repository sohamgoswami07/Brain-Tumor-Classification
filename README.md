# 🧠 Brain Tumor Classification

Builds and evaluates a Convolutional Neural Network (CNN) model to detect and classify brain tumors from MRI scans with \~93% accuracy.

## 📌 Table of Contents

* [Project Overview](#project-overview)
* [Features](#features)
* [Dataset](#dataset)
* [Model Architecture](#model-architecture)
* [Installation](#installation)
* [Usage](#usage)
* [Results](#results)
* [Future Work](#future-work)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

---

## Project Overview

This project aims to develop an end-to-end deep learning pipeline for brain tumor classification. It includes data preprocessing, model training, evaluation, and deployment, all within Python notebooks.

* **Dataset**: MRI images of brain tumors
* **Model**: Custom CNN implemented via TensorFlow/Keras
* **Classification**: Multi-class (e.g., glioma, meningioma, pituitary, healthy)
* **Accuracy**: \~93% accuracy achieved 

---

## Features

* 🧹 **Preprocessing**: Image resizing, normalization, augmentation
* 🏗️ **CNN Architecture**: Designed for accurate tumor detection
* ⚖️ **Evaluation**: Metrics like accuracy, precision, recall, F1‑score
* 💾 **Model Persistence**: Pretrained weights included for instant inference
* 📊 **Visualization**: Training curves, confusion matrices, sample predictions

---

## Dataset

* Data sourced from publicly available MRI collections
* Multi-class labels: glioma, meningioma, pituitary tumor, and no tumor
* Preprocessed images are included (resizing, normalization, augmentation)

---

## Model Architecture

* Custom CNN built in TensorFlow/Keras
* Dropout and batch normalization layers for regularization
* Training with cross-entropy loss & Adam optimizer
* Save and load model architecture and weights (e.g., `Model_Main3.h5`)

---

## Installation

```bash
# Clone repository
git clone https://github.com/sohamgoswami07/Brain-Tumor-Classification.git
cd Brain-Tumor-Classification

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Ensure availability of TensorFlow, Keras, NumPy, Matplotlib, etc.
```

---

## Usage

1. **Preprocess images**

   ```bash
   python preprocessing.py
   ```
2. **Train the model**

   ```bash
   python train_model.py
   ```
3. **Evaluate**

   ```bash
   python evaluate_model.py
   ```
4. **Load and use pretrained model**

   ```python
   import tensorflow as tf
   model = tf.keras.models.load_model('Model_Main3.h5')
   result = model.predict(your_processed_image)
   ```

---

## Results

* Achieved **\~93% accuracy** on test dataset
* Visual insights via confusion matrix & performance plots in `evaluation.ipynb`

---

## Future Work

* 📈 Improved performance using transfer learning (e.g., EfficientNet, Inception)&#x20;
* 🧩 Implement interpretability tools (e.g., Grad-CAM)
* ➕ Extend to tumor segmentation (e.g., U‑Net)
* 🌐 Deploy as a web API or app for real-world usage

---

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/name`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to your fork (`git push origin feature/name`)
5. Create a Pull Request

Please include clear descriptions and update documentation accordingly.

---

## License

This project is open-source under the **MIT License**.

---

## Contact

* **Soham Goswami** – [LinkedIn profile](https://www.linkedin.com/in/soham-python-developer/)
* LinkedIn: Feel free to connect for project feedback or collaborations

---
