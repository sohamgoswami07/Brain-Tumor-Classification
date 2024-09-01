// function show_image(src, width, height, alt) {
//     let img = document.createElement("img");
//     img.src = "data:image/jpeg;base64,"+src;
//     img.width = width;
//     img.height = height;
//     img.alt = alt;
//     document.body.appendChild(img);
// }

function scanBtn() {
    function show_image(src, width, height, alt) {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let img = document.createElement('img');

        img.src = "data:image/jpeg;base64," + src;
        img.width = width;
        img.height = height;
        img.alt = alt;

        img.onload = function () {
            // Set the canvas's width and height to match the image's dimensions
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.filter = 'brightness(100%) contrast(100%) sepia(100%)' ;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, img.width, img.height); // Draw the image on the canvas
            

            // Convert canvas to data URL
            let dataURL = canvas.toDataURL('image/jpeg', 0.9);
            photoCopy.src = dataURL;
        }
    }

    let files = document.getElementById('myFiles').files;
    let photoCopy = document.getElementById('photo-copy');

    for (let i = 0; i < files.length; i++) {
        (function (i) {
            let file = files[i];
            let formData = new FormData();
            formData.append("file", file);

            fetch('http://localhost:8000/predict', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.confidence <= 0.85) {
                        data.class = "Tumor found (New class)";
                    }
                    if(data.class == "no_tumor" && data.confidence <= 0.93) {
                        data.class= "Tumor found (Unidentified)";
                    }

                    let fileName = document.getElementById('file-name');
                    let clasification = document.getElementById('clasification');
                    let confidence = document.getElementById('confidence');

                    fileName.textContent = file.name;
                    clasification.textContent = data.class;
                    confidence.textContent = (data.confidence * 100).toFixed(2) + "%";

                    // Create a new progress bar for each file
                    let progressBar = document.getElementById('progress-bar');
                    progressBar.max = 100; // Set the maximum value
                    progressBar.value = (data.confidence * 100).toFixed(2);

                    show_image(data.image, 250, 250, data.class);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        })(i);
    }
}
