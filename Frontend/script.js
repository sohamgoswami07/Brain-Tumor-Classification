// function show_image(src, width, height, alt) {
//     let img = document.createElement("img");
//     img.src = "data:image/jpeg;base64,"+src;
//     img.width = width;
//     img.height = height;
//     img.alt = alt;
//     document.body.appendChild(img);
// }

function submit() {
    function show_image(src, width, height, alt) {
        var canvas = document.createElement('canvas');
        let hr = document.createElement('hr');
        var ctx = canvas.getContext('2d');
        let img = document.createElement("img");
        
        // let resultsDiv = document.getElementById('resultsDiv'); // Assuming 'resultsDiv' is the id of your div

        img.src = "data:image/jpeg;base64," + src;
        img.width = width;
        img.height = height;
        img.alt = alt;

        if (alt == "no_tumor") {
            resultsDiv.appendChild(img);
            resultsDiv.appendChild(hr);
        }
        else {
            img.onload = function () {
                // Set the canvas's width and height to match the image's dimensions
                canvas.width = img.width;
                canvas.height = img.height;

                ctx.filter = 'brightness(100%) contrast(100%) sepia(100%)' ;
                ctx.imageSmoothingQuality = "high";
                ctx.drawImage(img, 0, 0, img.width, img.height); // Draw the image on the canvas
                resultsDiv.appendChild(canvas);
                resultsDiv.appendChild(hr);
               
            }
        }
    }


    var files = document.getElementById("myFiles").files;
    var resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    for (var i = 0; i < files.length; i++) {
        (function (i) {
            var file = files[i];
            var formData = new FormData();
            formData.append("file", file);

            fetch('http://localhost:8000/predict', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.confidence <= 0.85) {
                        data.class = 'Tumor found(New class)';
                    }
                    if(data.class=="no_tumor" && data.confidence<=0.93){
                        data.class="Tumor Found(Unidentified)";
                    }                                                           

                    var p = document.createElement('p');
                    var x = document.createElement('x');
                    var y = document.createElement('y');
                    


                    // p.textContent = "File: " + file.name + ", Class: " + data.class + ", Confidence: " + (data.confidence * 100).toFixed(2) + "%";
                    p.textContent = "File: " + file.name;
                    x.textContent = "Class: " + data.class;
                    y.textContent = "Confidence: " + (data.confidence * 100).toFixed(2) + "%";




                    resultsDiv.appendChild(p);

                    resultsDiv.appendChild(x);

                    resultsDiv.appendChild(y);






                    // Create a new progress bar for each file
                    var progressBar = document.createElement('progress');
                    progressBar.value = (data.confidence * 100).toFixed(2);
                    progressBar.max = 100; // Set the maximum value
                    resultsDiv.appendChild(progressBar);

                    show_image(data.image, 200, 200, data.class);

                    

                    // Create a new button for each file


                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        })(i);
    }
}
