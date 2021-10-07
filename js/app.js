function draw(candidateGeneJSON, chtVersion) {
  let cancerColor = [
    '#59A6A1',
    '#F2A936',
    '#CE442C',
    '#1B83AA',
    '#80648A',
    '#EFB7A8',
    '#BADDC4',
    '#A8C5DB',
    '#E3CC69',
    '#D3C9BE',
    '#ACACA4',
    '#A3CCCD',
    '#BCA682',
    '#939552',
    '#9A5456',
    '#CE0F7D',
    '#F4D663',
    '#85C05F',
    '#E08770',
    '#6C0831',
    '#095893',
    '#002C4E',
    '#3B2748',
    '#4F3B39',
    '#231F20'
  ];
  let canvas = document.getElementById('canvas');

  // console.log(canvas);

  if (canvas.getContext) {
    let resize = 1;

    if (candidateGeneJSON.length > 4) {
      resize = resize * (4 / candidateGeneJSON.length + 0.1);
    }

    let ctx = canvas.getContext('2d');
    let init_x = 0.4 * 750;
    let init_y = 260;
    let init_radius = 180 * resize;
    let blankWidth = 0.004;
    let sAngle = 1.5;
    let eAngle = 1.5;
    let lineWidth = 15;
    let circleSpace = 18;
    let line_y_init = 260 - init_radius;
    let line_x_after = init_x + (init_radius + candidateGeneJSON.length * lineWidth) + 50;
    // let line_x_after = init_x + (180 + candidateGeneJSON.length * lineWidth) + 50 * resize;

    let triangle_x = line_x_after - 5;
    let triangle_y = line_y_init - 5;
    let cancerClass = [];

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // load images
    make_base(ctx, candidateGeneJSON, chtVersion, resize);
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    //draw multiple circles
    for (let i = candidateGeneJSON.length - 1; i >= 0; i--) {
      sAngle = 1.5;
      eAngle = 1.5;
      if (candidateGeneJSON[i].value === true) {
        for (let cancerIndex = 0; cancerIndex < candidateGeneJSON[i].cancer.length; cancerIndex++) {
          ctx.beginPath();
          lineWidth = 15;
          let candidateValue = parseFloat(candidateGeneJSON[i].cancer[cancerIndex].value);
          cancerClass.push(candidateGeneJSON[i].cancer[cancerIndex].name);

          let circlePercentageArc = 2 * (candidateValue / 100);
          if (candidateValue === 0) {
            // eAngle += 0.002;
            continue;
          }
          // let circlePercentageArc = candidateValue === 0 ? 0.002 : 2 * (candidateValue / 100);
          // sAngle = candidateValue === 0 ? eAngle + 0.002 : sAngle;

          if (eAngle - circlePercentageArc < 0) {
            eAngle = 2 + eAngle - circlePercentageArc;
          } else {
            eAngle = eAngle - circlePercentageArc;
          }

          if (cancerIndex === 0) {
            ctx.arc(init_x, init_y, init_radius, (sAngle - blankWidth) * Math.PI, eAngle * Math.PI, true);
          } else if (cancerIndex === candidateGeneJSON[i].cancer.length - 1) {
            ctx.arc(init_x, init_y, init_radius, sAngle * Math.PI, eAngle * Math.PI, true);
          } else {
            ctx.arc(init_x, init_y, init_radius, sAngle * Math.PI, eAngle * Math.PI, true);
          }
          ctx.lineWidth = lineWidth;
          // console.log(cancerIndex, cancerColor[cancerIndex]);

          ctx.strokeStyle = cancerColor[cancerIndex];

          sAngle = eAngle;
          ctx.stroke();
        }
      } else {
        // console.log("here");
        ctx.beginPath();
        sAngle = 1.5;
        eAngle = 1.4999;
        ctx.arc(init_x, init_y, init_radius, (sAngle - blankWidth) * Math.PI, eAngle * Math.PI, true);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = '#D9D9D9';
        ctx.stroke();
      }

      init_radius += circleSpace;
    }

    //draw arrow and arrow text (gene label)
    for (let i = candidateGeneJSON.length - 1; i >= 0; i--) {
      if (candidateGeneJSON[i].gene !== 'NA') {
        ctx.beginPath();
        ctx.textAlign = 'start';
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.moveTo(init_x + 2, line_y_init);
        ctx.lineTo(line_x_after, line_y_init);

        ctx.font = '14px Calibri';
        ctx.fillText(candidateGeneJSON[i].gene, line_x_after + 5, line_y_init);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(triangle_x, triangle_y);
        ctx.lineTo(triangle_x, triangle_y + 10);
        ctx.lineTo(triangle_x + 5, triangle_y + 5);
        ctx.fill();
        ctx.stroke();
      }
      line_y_init -= circleSpace;
      triangle_y -= circleSpace;
    }

    //draw lengend and legend text (cancer label)

    let uniqueCancerClass = [...new Set(cancerClass)];
    // console.log(uniqueCancerClass);
    let label_x = 800;
    let label_radius = 4;
    let label_y = 490 - uniqueCancerClass.length * 20;

    for (let cancerIndex = 0; cancerIndex < uniqueCancerClass.length; cancerIndex++) {
      ctx.beginPath();
      ctx.strokeStyle = cancerColor[cancerIndex];
      ctx.fillStyle = cancerColor[cancerIndex];
      ctx.lineWidth = 1;
      // ctx.strokeStyle = "white";

      ctx.arc(line_x_after, label_y, label_radius, 0 * Math.PI, 2 * Math.PI, true);
      ctx.fill();

      ctx.fillStyle = 'black';
      ctx.font = '14px Microsoft JhengHei';
      // console.log(ctx.font);

      ctx.fillText(uniqueCancerClass[cancerIndex], line_x_after + 10, label_y);
      ctx.stroke();
      label_y += 20;
    }
  }
}

function make_base(ctx, candidateGeneJSON, chtVersion, resize) {
  base_image = new Image();

  let isAbmormal = candidateGeneJSON.some(geneList => {
    return geneList.value === true;
  });

  if (isAbmormal) {
    if (chtVersion) {
      base_image.src = './images/abnormal.png';
    } else {
      base_image.src = './images/abnormal_en.png';
      console.log('eng version');
    }
  } else {
    if (chtVersion) {
      base_image.src = './images/normal.png';
    } else {
      base_image.src = './images/normal_en.png';
      console.log('eng version');
    }
  }

  base_image.onload = function() {
    ctx.drawImage(
      base_image,
      canvas.width * 0.4 - (190 / 2) * resize,
      canvas.height / 2 - (160 / 2) * resize - 15,
      190 * resize,
      160 * resize
    );
  };
}

$(document).ready(function() {
  let defaultGeneJSON = [
    {
      gene: 'TP53',
      cancer: [
        {
          name: '卵巢癌',
          value: 20
        },
        {
          name: '淋巴癌',
          value: 16
        },
        {
          name: '子宮頸癌',
          value: 18
        },
        {
          name: '肺癌',
          value: 10
        },
        {
          name: '皮膚癌',
          value: 18
        },
        {
          name: '胃癌',
          value: 18
        }
      ],
      value: true
    },
    {
      gene: 'MME',
      cancer: [
        {
          name: '卵巢癌',
          value: 9
        },
        {
          name: '淋巴癌',
          value: 30
        },
        {
          name: '子宮頸癌',
          value: 25
        },
        {
          name: '肺癌',
          value: 18
        },
        {
          name: '皮膚癌',
          value: 15
        },
        {
          name: '胃癌',
          value: 3
        }
      ],
      value: true
    },
    {
      gene: 'NOTCH1',
      cancer: [
        {
          name: '卵巢癌',
          value: 20
        },
        {
          name: '淋巴癌',
          value: 16
        },
        {
          name: '子宮頸癌',
          value: 18
        },
        {
          name: '肺癌',
          value: 10
        },
        {
          name: '皮膚癌',
          value: 18
        },
        {
          name: '胃癌',
          value: 18
        }
      ],
      value: false
    },
    {
      gene: 'ELAVL1',
      cancer: [
        {
          name: '卵巢癌',
          value: 20
        },
        {
          name: '淋巴癌',
          value: 16
        },
        {
          name: '子宮頸癌',
          value: 18
        },
        {
          name: '肺癌',
          value: 10
        },
        {
          name: '皮膚癌',
          value: 18
        },
        {
          name: '胃癌',
          value: 18
        }
      ],
      value: false
    }
  ];
  let chtVersion = $('#chinese')[0].checked;
  draw(defaultGeneJSON, chtVersion);

  const fileUploader = document.querySelector('#file-uploader');
  const fileName = document.querySelector('#fileName');

  fileUploader.addEventListener('change', e => {
    let candidateGeneJSON = [];

    // console.log(e.target.files); // get file object
    fileName.innerHTML = e.target.files[0].name;
    // $('#fileName').val(e.target.files[0].name);

    let file = fileUploader.files[0];
    let textType = ['text/plain', 'application/vnd.ms-excel'];

    let reader = new FileReader();
    chtVersion = $('#chinese')[0].checked;

    reader.onload = function(e) {
      // console.log(e);

      e.target.innerText = reader.result;
      let splitFormat = file.type === 'text/plain' ? '\t' : ',';
      let lines = e.target.innerText.split('\n');
      let columnTitle = lines[0].split(splitFormat);

      columnTitle.shift();
      // console.log(columnTitle);
      for (let i = 1; i < lines.length; i++) {
        if (lines[i] != '') {
          let cancerPercentArr = lines[i].split(splitFormat);
          let gene = cancerPercentArr.shift();
          let cancerTotal = cancerPercentArr.reduce((sum, percentage) => parseFloat(sum) + parseFloat(percentage));
          let value = cancerTotal == 0 ? false : true;

          if (cancerTotal < 99.99999 || cancerTotal >= 100.00999) {
            alert(gene + `的癌腫比例 :${cancerTotal}% 不正確(<100% 或 > 100%) 請再重新確認一次`);
            return;
          }

          let cancerArr = [];
          for (let cancerIndex = 0; cancerIndex < columnTitle.length; cancerIndex++) {
            let cancerTypeJson = {
              name: columnTitle[cancerIndex],
              value: cancerPercentArr[cancerIndex]
            };

            cancerArr.push(cancerTypeJson);
          }
          // console.log(cancerArr);
          let geneDetail = {
            gene: gene,
            cancer: cancerArr,
            value: value
          };

          candidateGeneJSON.push(geneDetail);
        }
      }
      // console.log(lines.length);

      if (lines.length <= 5) {
        for (let i = lines.length - 1; i < 5; i++) {
          let cancerArr = [];
          for (let cancerIndex = 0; cancerIndex < columnTitle.length; cancerIndex++) {
            let cancerTypeJson = {
              name: columnTitle[cancerIndex],
              value: 0
            };

            cancerArr.push(cancerTypeJson);
          }
          let geneDetail = {
            gene: 'NA',
            cancer: cancerArr,
            value: false
          };
          candidateGeneJSON.push(geneDetail);
        }
      }

      draw(candidateGeneJSON, chtVersion);
    };

    reader.readAsText(file, 'big5');
    // console.log($('#file-uploader'));

    $('#file-uploader')[0].value = '';
  });

  let geneSave = document.getElementById('cancer-save');
  geneSave.addEventListener(
    'click',
    function(e) {
      // console.log(e);
      var canvas = document.getElementById('canvas');

      var fullQuality = canvas.toDataURL('image/png', 1.0).replace('image/png', 'image/octet-stream');
      var link = document.createElement('a');
      link.download = 'CancerScan-download.png';
      link.href = fullQuality;
      link.click();
    },
    false
  );
});
