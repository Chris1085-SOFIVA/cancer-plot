function draw(candidateGeneJSON) {
  let cancerColor = ["#59A6A1", "#F2A936", "#CE442C", "#1B83AA", "#80648A", "#EFB7A8", "#BADDC4", "#A8C5DB", "#E3CC69", "#D3C9BE", "#ACACA4", "#A3CCCD", "#BCA682", "#939552", "#9A5456", "#CE0F7D", "#F4D663", "#85C05F", "#E08770", "#6C0831", "#095893", "#002C4E", "#3B2748", "#4F3B39", "#231F20"];
  let canvas = document.getElementById("canvas");

  // console.log(canvas);

  if (canvas.getContext) {
    let ctx = canvas.getContext("2d");
    let init_x = 450;
    let init_y = 300;
    let init_radius = 180;
    let blankWidth = 0.003;
    let sAngle = 1.5;
    let eAngle = 1.5;
    let lineWidth = 15;
    let circleSpace = 18;
    let line_y_init = 300 - init_radius;
    let line_x_after = init_x + (init_radius + candidateGeneJSON.length * lineWidth) + 50;
    let triangle_x = line_x_after - 5;
    let triangle_y = line_y_init - 5;
    let cancerClass = [];
    // console.log(line_x_after);

    // ctx.fillStyle = "white";
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    make_base(ctx, candidateGeneJSON);

    ctx.fillStyle = "black";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = candidateGeneJSON.length - 1; i >= 0; i--) {

      if (candidateGeneJSON[i].value === true) {

        for (let cancerIndex = 0; cancerIndex < candidateGeneJSON[i].cancer.length; cancerIndex++) {
          ctx.beginPath();
          lineWidth = 15;
          // console.log(candidateGeneJSON[i].cancer[cancerIndex].name);
          circlePercentageArc = 2 * (candidateGeneJSON[i].cancer[cancerIndex].value / 100);
          if (eAngle - circlePercentageArc < 0) {
            eAngle = 2 + eAngle - circlePercentageArc;
          } else {
            eAngle = eAngle - circlePercentageArc;
          }
          // eAngle = eAngle - circlePercentageArc;
          // console.log(sAngle, eAngle);

          if (cancerIndex === 0) {
            ctx.arc(init_x, init_y, init_radius, (sAngle - blankWidth) * Math.PI, (eAngle) * Math.PI, true);

          } else if (cancerIndex === candidateGeneJSON[i].cancer.length - 1) {
            ctx.arc(init_x, init_y, init_radius, (sAngle) * Math.PI, (eAngle + blankWidth) * Math.PI, true);
          } else {
            ctx.arc(init_x, init_y, init_radius, (sAngle) * Math.PI, (eAngle) * Math.PI, true);
          }
          ctx.lineWidth = lineWidth;
          ctx.strokeStyle = cancerColor[cancerIndex];

          sAngle = eAngle;
          ctx.stroke();

          cancerClass.push(candidateGeneJSON[i].cancer[cancerIndex].name);

        }
      } else {
        // console.log("here");
        ctx.beginPath();
        sAngle = 1.5;
        eAngle = 1.4999;
        ctx.arc(init_x, init_y, init_radius, (sAngle - blankWidth) * Math.PI, (eAngle + blankWidth) * Math.PI, true);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = "#D9D9D9";
        ctx.stroke();

      }

      init_radius += circleSpace;
    }


    for (let i = candidateGeneJSON.length - 1; i >= 0; i--) {
      ctx.beginPath();
      ctx.textAlign = "start";
      ctx.lineWidth = 1;
      ctx.strokeStyle = "black";
      ctx.moveTo(init_x + 2, line_y_init);
      ctx.lineTo(line_x_after, line_y_init);

      ctx.font = "14px Calibri";
      ctx.fillText(candidateGeneJSON[i].gene, line_x_after + 5, line_y_init);
      ctx.stroke();
      line_y_init -= circleSpace;

      ctx.beginPath();
      ctx.moveTo(triangle_x, triangle_y);
      ctx.lineTo(triangle_x, triangle_y + 10);
      ctx.lineTo(triangle_x + 5, triangle_y + 5);
      ctx.fill();
      ctx.stroke();
      triangle_y -= circleSpace;
    }


    let label_x = 800;
    let label_y = 450;
    let label_radius = 4;
    let uniqueCancerClass = [...new Set(cancerClass)];
    for (let cancerIndex = 0; cancerIndex < uniqueCancerClass.length; cancerIndex++) {
      ctx.beginPath();
      ctx.strokeStyle = cancerColor[cancerIndex];
      ctx.fillStyle = cancerColor[cancerIndex];
      ctx.lineWidth = 1;
      // ctx.strokeStyle = "white";

      ctx.arc(label_x, label_y, label_radius, 0 * Math.PI, 2 * Math.PI, true);
      ctx.fill();

      ctx.fillStyle = "black";
      ctx.fillText(uniqueCancerClass[cancerIndex], label_x + 15, label_y);
      ctx.stroke();
      label_y += 20;
    }
  }
}

function make_base(ctx, candidateGeneJSON) {
  base_image = new Image();

  let isAbmormal = candidateGeneJSON.some((geneList) => {
    return geneList.value === true;
  });

  if (isAbmormal) {
    base_image.src = "../images/abnormal.png";
  } else {
    base_image.src = "../images/normal.png";
  }

  base_image.onload = function () {
    ctx.drawImage(base_image, canvas.width / 2 - 90, canvas.height / 2 - 75);
  };
}


$(document).ready(function () {
  let candidateGeneJSON = [{
      gene: "TP53",
      cancer: [{
        name: "卵巢癌",
        value: 20
      }, {
        name: "淋巴癌",
        value: 16
      }, {
        name: "子宮頸癌",
        value: 18
      }, {
        name: "肺癌",
        value: 10
      }, {
        name: "皮膚癌",
        value: 18
      }, {
        name: "胃癌",
        value: 18
      }],
      value: true
    },
    {
      gene: "MME",
      cancer: [{
        name: "卵巢癌",
        value: 9
      }, {
        name: "淋巴癌",
        value: 30
      }, {
        name: "子宮頸癌",
        value: 25
      }, {
        name: "肺癌",
        value: 18
      }, {
        name: "皮膚癌",
        value: 15
      }, {
        name: "胃癌",
        value: 3
      }],
      value: true
    },
    {
      gene: "NOTCH1",
      cancer: [{
        name: "卵巢癌",
        value: 20
      }, {
        name: "淋巴癌",
        value: 16
      }, {
        name: "子宮頸癌",
        value: 18
      }, {
        name: "肺癌",
        value: 10
      }, {
        name: "皮膚癌",
        value: 18
      }, {
        name: "胃癌",
        value: 18
      }],
      value: false
    },
    {
      gene: "ELAVL1",
      cancer: [{
        name: "卵巢癌",
        value: 20
      }, {
        name: "淋巴癌",
        value: 16
      }, {
        name: "子宮頸癌",
        value: 18
      }, {
        name: "肺癌",
        value: 10
      }, {
        name: "皮膚癌",
        value: 18
      }, {
        name: "胃癌",
        value: 18
      }],
      value: false
    }
  ];



  let canvasClearJSON = {
    gene1: {
      name: "Option 1",
      init_x: 470,
      init_y: 5
    },
    gene2: {
      name: "Option 2",
      init_x: 660,
      init_y: 95
    },
    gene3: {
      name: "Option 3",
      init_x: 710,
      init_y: 285
    },
    gene4: {
      name: "Option 4",
      init_x: 540,
      init_y: 495
    },
    gene5: {
      name: "Option 5",
      init_x: 210,
      init_y: 495
    },
    gene6: {
      name: "Option 6",
      init_x: 10,
      init_y: 285
    },
    gene7: {
      name: "Option 7",
      init_x: 60,
      init_y: 90
    },
    gene8: {
      name: "Option 8",
      init_x: 240,
      init_y: 5
    }
  };

  // // let geneCheck = document.getElementById('gene-check');
  // // geneCheck.addEventListener('click', function(e) {}, false);

  // $(".form-check-input").change(function (e) {
  //   // console.log(e);
  //   // console.log($(e.target.checked));
  //   if ($(e.target.checked)[0] == true) {
  //     //add comment
  //     annotateCanvas(canvasAnnotateJSON[e.target.id]);
  //     // console.log(e.target.id);
  //     // addCanvas();
  //   } else {
  //     // clear comment
  //     clearCanvas(canvasClearJSON[e.target.id]);
  //   }
  // });

  // let geneSave = document.getElementById("gene-save");
  // geneSave.addEventListener(
  //   "click",
  //   function (e) {
  //     // console.log(e);
  //     var canvas = document.getElementById("canvas");
  //     geneSave.download = "test3.png";

  //     var fullQuality = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
  //     var link = document.createElement("a");
  //     link.download = "my-image.png";
  //     link.href = fullQuality;
  //     link.click();
  //   },
  //   false
  // );

  draw(candidateGeneJSON);
});