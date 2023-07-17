// JavaScript code in script.js file



window.addEventListener("DOMContentLoaded", function() {

  var form = document.querySelector('.form');

  var submitButton = document.getElementById("submitButton");

  

  // Disable submit button on page load

  submitButton.disabled = true;



  // Function to check form validity

  function checkFormValidity() {

    var phoneInput = form.querySelector('input[name="phone"]');

    var quantityInput = form.querySelector('input[name="quantity"]:checked');

    var imageInput = form.querySelector('input[name="images[]"]');

    

    // Check if all three conditions are satisfied

    if (phoneInput.value.trim() !== "" && quantityInput && imageInput.files.length > 0) {

      submitButton.disabled = false;

    } else {

      submitButton.disabled = true;

    }

  }



  // Event listener for form input changes

  form.addEventListener("change", checkFormValidity);



  // Event listener for form submission

  form.addEventListener("submit", function(e) {

    e.preventDefault();

    var data = new FormData(this);

    sendMsg(data);

  });



  function sendMsg(data) {

    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'secret/config.txt', true);

    xhr.onreadystatechange = function () {

      if (xhr.readyState === 4 && xhr.status === 200) {

        var lines = xhr.responseText.split('\n');

        var token = lines[0].trim();

        var chatId = lines[1].trim();



        var url = 'https://api.telegram.org/bot' + token + '/sendMessage';

        var textData = {

          chat_id: chatId,

          parse_mode: 'Markdown',

          text: '*New Order:*\n' + data.get("title") + data.get("phone") + '\n*Quantity:* ' + data.get("quantity") + '\n Have a good day!💖'

        };



        var images = data.getAll("images[]");

        var imageCount = Math.min(images.length, 2);

        var imageProcessed = 0;



        var sendPhoto = function (index) {

          var formData = new FormData();

          formData.append("chat_id", chatId);

          formData.append("photo", images[index]);



          fetch('https://api.telegram.org/bot' + token + '/sendPhoto', {

            method: 'POST',

            body: formData

          })

          .then(response => response.json())

          .then(result => {

            console.log(result); // Output the response to the console for debugging



            imageProcessed++;

            if (imageProcessed === imageCount) {

              fetch('https://api.telegram.org/bot' + token + '/sendMessage', {

                method: 'POST',

                headers: {

                  'Content-type': 'application/json; charset=utf-8'

                },

                body: JSON.stringify(textData)

              })

              .then(response => {

                if (response.ok) {

                  window.location.href = "thanks.html"; // Redirect to thanks.html on successful submission

                } else {

                  console.error("Error sending message to Telegram");

                }

              })

              .catch(error => {

                console.error("Error sending message to Telegram", error);

              });

            }

          })

          .catch(error => {

            console.error("Error sending photo to Telegram", error);

          });

        };



        if (images.length > 2) {

          submitButton.disabled = true;

          window.alert("Please select up to 2 images only.");

          return;

        }



        for (var i = 0; i < imageCount; i++) {

          sendPhoto(i);

        }

      }

    };

    xhr.send();

  }

});

