// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const $ = require('jquery')
const remote = require('electron').remote

$('#analyze-progress').hide()
$('#after-analyzing').hide()
$('.step-2').hide()
$('.step-3').hide()
$('.step-4').hide()
$('#analyze-error').hide()

$('#close-btn').on('click', e => {
    remote.getCurrentWindow().close()
})
$('#minimize-btn').on('click', e => {
    remote.getCurrentWindow().minimize()
})

denoiseVal = false;
document.getElementById("quant-range").addEventListener("change", function () { rangeUpdater(); });

function rangeUpdater() {
    document.getElementById("quant-val").innerText = document.getElementById("quant-range").value;  // The function returns the product of p1 and p2
}

function fileNameUpdater() {
    document.getElementById("file-name").innerText = document.getElementById("convert-file").files[0].name;  // The function returns the product of p1 and p2
}

function preview_analysis_data(data) {
    document.getElementById("prediction-val").innerText = data.classification;
    document.getElementById("color-val").innerText = data.color_count;
    document.getElementById("quant-val").innerText = data.quant_val;

    document.getElementById("quant-range").value = data.quant_val;

    document.getElementById("ltres-val").value = data.row.ltres;
    document.getElementById("qtres-val").value = data.row.qtres;
    document.getElementById("pathomit-val").value = data.row.pathomit;
}

function analyze_file() {
    $.ajax({
        url: "http://127.0.0.1:5000/analyze?file_path=" + document.getElementById("convert-file").files[0].path,
        dataType: "json",
        success: function (data) {
            console.log(data);

            $('.step-1').hide();
            $('.step-2').show();

            $(".on-hover").css("pointer-events", "auto");

            preview_analysis_data(data);
        },
        error: function (data) {
            $('#analyze-error').show()

            $('#before-analyzing').show()
            $('#after-analyzing').hide()

            $(".on-hover").css("pointer-events", "auto");
            $('#analyze-btn').attr("disabled", false);
            $('#analyze-progress').hide();
        }

    })
}

$("#denoise").change(function () {
    console.log(this.checked);
    denoiseVal = this.checked;
});

$("#convert-btn").click(function () {

    $('.step-2').hide();
    $('.step-3').show();

    $.ajax({
        url: "http://127.0.0.1:5000/convert?" +
            "file_path=" + document.getElementById("convert-file").files[0].path +
            "&file_name=" + document.getElementById("convert-file").files[0].name +
            "&ltres=" + document.getElementById("ltres-val").value +
            "&qtres=" + document.getElementById("qtres-val").value +
            "&pathomit=" + document.getElementById("pathomit-val").value +
            "&k=" + document.getElementById("quant-range").value +
            "&denoiseBool=" + denoiseVal,
        dataType: "json",
        success: function (data) {
            console.log(data)

            document.getElementById("file-out-path").innerText = data.out_path;

            $('.step-3').hide();
            $('.step-4').show();
        }
    })
})


$('#custom-uploader').on('click', e => {
    $("#convert-file").click();
})

$("#convert-file").change(function () {
    fileNameUpdater();
});

$('#analyze-btn').on('click', e => {

    $('#before-analyzing').hide()
    $('#after-analyzing').show()

    $(".on-hover").css("pointer-events", "none");
    $('#analyze-btn').attr("disabled", true);
    $('#analyze-progress').show();

    analyze_file();
})


$('#goback-btn').on('click', e => {
    location.reload();
})