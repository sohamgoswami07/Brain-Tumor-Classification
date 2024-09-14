// Background video playback speed JS script
let bgVideo = document.querySelector(".bg-video");
bgVideo.playbackRate += 1.5; // Playback speed rate increased by 1.5x

// File upload JS script
let form = document.querySelector("form");
let fileInput = document.querySelector(".file-input");
let progressArea = document.querySelector(".progress-area");
let uploadedArea = document.querySelector(".uploaded-area");

form.addEventListener("click", () => {
    fileInput.click();
    progressArea.innerHTML ='';
    uploadedArea.innerHTML ='';
});
fileInput.onchange = ({ target }) => {
    let file = target.files[0];
    if (file) {
        let fileName = file.name;
        if (fileName.length >= 12) {
            let splitName = fileName.split('.');
            fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
        }
        uploadFile(fileName);
    }
}
function uploadFile(name) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "php/upload.php");
    xhr.upload.addEventListener("progress", ({ loaded, total }) => {
        let fileLoaded = Math.floor((loaded / total) * 100);
        let fileTotal = Math.floor(total / 1000);
        let fileSize;
        (fileTotal < 1024) ? fileSize = fileTotal + " KB" : fileSize = (loaded / (1024 * 1024)).toFixed(2) + " MB";
        let progressHTML = `<li class="upload-row">
                                <div class="content">
                                    <div class="details">
                                        <p class="name">${name} • Uploading</p>
                                        <p class="percent">${fileLoaded}%</p>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress" style="width: ${fileLoaded}%"></div>
                                    </div>
                                </div>
                            </li>`;
        uploadedArea.classList.add("onprogress");
        progressArea.innerHTML = progressHTML;
        if (loaded == total) {
            progressArea.innerHTML = "<p>Files uploaded successfully</p>";
            let uploadedHTML = `<li class="upload-row">
                                    <div class="content upload">
                                        <div class="details">
                                            <p class="name">${name} • Uploaded</p>
                                            <p class="size">${fileSize}</p>
                                        </div>
                                    </div>
                                </li>`;
            uploadedArea.classList.remove("onprogress");
            uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
        }
    });
    let data = new FormData(form);
    xhr.send(data);
}

// Main function and image processing JS script
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
    let resultsContainer = document.querySelector(".results");
    let resultSection = document.querySelector(".result-section");

    resultSection.style.display = 'block';
    resultSection.scrollIntoView({behavior: 'smooth'});
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
                    if ((data.confidence <= 0.85) || (data.class == "no_tumor" && data.confidence <= 0.93)) {
                        data.class = "No tumor found";
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
                                <div class="photo-copy">
                                    <img src="${processedImageSrc}">
                                </div>
                                <div class="result-details">
                                    <strong class="result-values">File Name: <p>${fileName}</p></strong>
                                    <strong class="result-values">Classification: <p>${classification}</p></strong>
                                    <strong class="result-values">Confidence: <p>${confidence}</p></strong>
                                    <progress class="progress-bar" value=${(data.confidence * 100).toFixed(2)} max="100"></progress>
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