function scanBtn() {
    // Image processing function execution
    function show_image(src, width, height, alt) {
        return new Promise((resolve, reject) => {
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            let img = document.createElement("img");
    
            // No need to prepend "data:image/jpeg;base64," here as it's already included
            img.src = src; // Just use the base64 source as is
            img.width = width;
            img.height = height;
            img.alt = alt;
    
            img.onload = function () {
                // Set the canvas's width and height to match the image's dimensions
                canvas.width = img.width;
                canvas.height = img.height;
    
                ctx.filter = "brightness(100%) contrast(100%) sepia(100%)";
                ctx.imageSmoothingQuality = "high";
                ctx.drawImage(img, 0, 0, img.width, img.height); // Draw the image on the canvas
    
                // Convert canvas to data URL to get jpeg format
                let dataURL = canvas.toDataURL("image/jpeg", 0.9);
                resolve(dataURL);  // Resolve with the data URL
            };
    
            img.onerror = function () {
                reject("Image load error");
            };
        });
    }

    let files = document.getElementById("myFiles").files;
    let resultsContainer = document.getElementById("results");

    resultsContainer.innerHTML = ''; // Clear previous results

    for (let i = 0; i < files.length; i++) {
        (function (i) {
            let file = files[i];
            let formData = new FormData();
            formData.append("file", file);

            fetch("http://localhost:8000/predict", {
                method: "POST",
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.confidence <= 0.85) {
                        data.class = "Tumor found (New class)";
                    }
                    if(data.class == "no_tumor" && data.confidence <= 0.93) {
                        data.class = "Tumor found (Unidentified)";
                    }

                    let fileName = file.name;
                    let classification = data.class;
                    let confidence = (data.confidence * 100).toFixed(2) + "%";

                    // Process image and add it to the result
                    let reader = new FileReader();
                    reader.onload = function (e) {
                        show_image(e.target.result, 200, 200, fileName).then((processedImageSrc) => {
                            let results = document.createElement("div");
                            results.classList.add("file-result");

                            results.innerHTML = `
                                <div id="photo-copy">
                                    <img src="${processedImageSrc}">
                                </div>
                                <div id="result-details">
                                    <strong id="result-values">File Name: <p>${fileName}</p></strong>
                                    <strong id="result-values">Classification: <p>${classification}</p></strong>
                                    <strong id="result-values">Confidence: <p>${confidence}</p></strong>
                                    <progress id="progress-bar" value=${(data.confidence * 100).toFixed(2)} max="100"></progress>
                                </div>
                            `;
                            resultsContainer.appendChild(results);
                        });
                    };
                    reader.readAsDataURL(file); // Read file as base64 string
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        })(i);
    }
}