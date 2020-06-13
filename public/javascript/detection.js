const cocossd = () => {
    let imgName = document.getElementById("fileUpload").value.split("\\");
    imgName = imgName[imgName.length - 1];
    let detail = document.getElementById("prediction");
    //Début chargement
    document.getElementsByTagName("BODY")[0].style.opacity = "0.3";
    document.getElementById("loading").style.display = "block";
    const img = document.getElementById('overlay');

    // Load the model.
    cocoSsd
        .load(config = {
            base: 'mobilenet_v2'
        })
        .then(model => {
            model
                .detect(img)
                .then(predictions => {
                    let overlay = document.getElementById("overlay");
                    let ctext = overlay.getContext('2d', { alpha: true });
                    if (predictions.length) {
                        let newRow = detail.insertRow(0);
                        let newCellName = newRow.insertCell();
                        let newCellClass = newRow.insertCell();
                        let listClass = document.createElement("ol");
                        newCellClass.appendChild(listClass);
                        let newCellScore = newRow.insertCell();
                        let listScore = document.createElement("ul");
                        newCellScore.appendChild(listScore);

                        newCellName.innerHTML = imgName;
                        predictions.forEach((pred) => {
                            const xPosBox = pred.bbox[0]
                            const yPosBox = pred.bbox[1]
                            const widthBox = pred.bbox[2]
                            const heightBox = pred.bbox[3]
                            ctext.beginPath();
                            ctext.rect(
                                xPosBox,/* x */
                                yPosBox,/* y */
                                widthBox,/* width */
                                heightBox/* height */
                            );
                            ctext.stroke();
                            ctext.font = "15px Arial";
                            ctext.fillStyle = "orange";
                            ctext.fillRect(xPosBox, yPosBox + heightBox - 18, (ctext.measureText(pred.class).width + ctext.measureText(`: ${Math.floor(pred.score)}%%`).width), 18);
                            ctext.fillStyle = "black";
                            ctext.fillText(`${pred.class}: ${Math.floor(pred.score * 100)}%`, xPosBox + 5, yPosBox + heightBox - 5);
                            listClass.innerHTML += "<li>" + pred.class + "</li>";
                            listScore.innerHTML += "<li>" + Math.floor(pred.score * 100) + "%" + "</li>";
                        });
                    }

                    document.getElementsByTagName("BODY")[0].style.opacity = "1";
                    document.getElementById("loading").style.display = "none";// Fin chargement

                    // Récupération nouvelle image
                    const result = {
                        imageName: imgName,
                        detections: predictions.map((a) => {
                            return {
                                class: a.class,
                                score: a.score
                            }
                        }),
                        date: new Date()
                    };

                    // Envoi des données
                    if (result.detections.length) {
                        fetch("/", {
                            headers: {
                                "Content-Type": "application/json"
                            },
                            method: "POST",
                            body: JSON.stringify(result)
                        });
                    } else {
                        alert("Aucun résultat pour cette image");
                    }
                })
            ;
        })
    ;
};

document.getElementById("fileUpload").onchange = () => {
    const input = document.getElementById("fileUpload");
    if (input.files && input.files[0]) {
        //Changement image dans canvas
        const ctx = document.getElementById('overlay').getContext('2d');
        const img = new Image();
        img.onload = (e) => {
            ctx.canvas.width = img.width;
            ctx.canvas.height = img.height;
            ctx.lineWidth = '3';
            ctx.strokeStyle = 'rgba(255, 165, 0, 1)';
            ctx.drawImage(img, 0, 0);
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);

        //Recherche
        cocossd();
    }
}
