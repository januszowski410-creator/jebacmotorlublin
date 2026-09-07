var selector = document.querySelector(".selector_box");

selector.addEventListener('click', () => {
    if (selector.classList.contains("selector_open")) {
        selector.classList.remove("selector_open");
    } else {
        selector.classList.add("selector_open");
    }
});

document.querySelectorAll(".date_input").forEach((element) => {
    element.addEventListener('click', () => {
        document.querySelector(".date").classList.remove("error_shown");
    });
});

var sex = "m";

document.querySelectorAll(".selector_option").forEach((option) => {
    option.addEventListener('click', () => {
        sex = option.id;
        document.querySelector(".selected_text").innerHTML = option.innerHTML;
    });
});

var upload = document.querySelector(".upload");

var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = ".jpeg,.jpg,.png,.gif";

document.querySelectorAll(".input_holder").forEach((element) => {

    var input = element.querySelector(".input");

    input.addEventListener('click', () => {
        element.classList.remove("error_shown");
    });

});


/* UPLOADCARE */

const UPLOADCARE_PUBLIC_KEY = "5ad36bf575bbe28f510e";


upload.addEventListener('click', () => {
    imageInput.click();
    upload.classList.remove("error_shown");
});


imageInput.addEventListener('change', async () => {

    var file = imageInput.files[0];

    if (!file) {
        return;
    }

    upload.classList.remove("upload_loaded");
    upload.classList.add("upload_loading");
    upload.removeAttribute("selected");

    var data = new FormData();

    data.append("UPLOADCARE_PUB_KEY", UPLOADCARE_PUBLIC_KEY);
    data.append("UPLOADCARE_STORE", "auto");
    data.append("file", file);

    try {

        var result = await fetch(
            "https://upload.uploadcare.com/base/",
            {
                method: "POST",
                body: data
            }
        );

        var response = await result.json();

        console.log("Uploadcare response:", response);

        if (!result.ok || !response.file) {
            throw new Error(
                response.detail ||
                response.error ||
                "Nie udało się przesłać zdjęcia."
            );
        }

        var uuid = response.file;

        var url = "https://ucarecdn.com/" + uuid + "/";

        upload.classList.remove("error_shown");
        upload.setAttribute("selected", url);
        upload.classList.add("upload_loaded");
        upload.classList.remove("upload_loading");

        upload.querySelector(".upload_uploaded").src = url;

        console.log("Upload zakończony pomyślnie:", url);

    } catch (error) {

        console.error("Uploadcare error:", error);

        upload.classList.remove("upload_loading");
        upload.classList.remove("upload_loaded");
        upload.removeAttribute("selected");

        upload.classList.add("error_shown");

        alert(
            "Nie udało się przesłać zdjęcia.\n\n" +
            error.message
        );
    }

});


document.querySelector(".go").addEventListener('click', () => {

    var empty = [];

    var params = new URLSearchParams();

    params.set("sex", sex);

    if (!upload.hasAttribute("selected")) {

        empty.push(upload);
        upload.classList.add("error_shown");

    } else {

        params.set(
            "image",
            upload.getAttribute("selected")
        );

    }

    var birthday = "";
    var dateEmpty = false;

    document.querySelectorAll(".date_input").forEach((element) => {

        birthday = birthday + "." + element.value;

        if (isEmpty(element.value)) {
            dateEmpty = true;
        }

    });

    birthday = birthday.substring(1);

    if (dateEmpty) {

        var dateElement = document.querySelector(".date");

        dateElement.classList.add("error_shown");

        empty.push(dateElement);

    } else {

        params.set("birthday", birthday);

    }

    document.querySelectorAll(".input_holder").forEach((element) => {

        var input = element.querySelector(".input");

        if (isEmpty(input.value)) {

            empty.push(element);

            element.classList.add("error_shown");

        } else {

            params.set(input.id, input.value);

        }

    });

    if (empty.length != 0) {

        empty[0].scrollIntoView();

    } else {

        forwardToId(params);

    }

});


function isEmpty(value) {

    let pattern = /^\s*$/;

    return pattern.test(value);

}


/* POPRAWIONE DLA GITHUB PAGES */

function forwardToId(params) {

    location.href = "./id.html?" + params;

}


var guide = document.querySelector(".guide_holder");

guide.addEventListener('click', () => {

    if (guide.classList.contains("unfolded")) {

        guide.classList.remove("unfolded");

    } else {

        guide.classList.add("unfolded");

    }

});
