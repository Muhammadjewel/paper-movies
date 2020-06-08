$(document).ready(function () {
  // Qidiruv formasini eslab qolish
  var elSearchForm = $('.js-movie-search-form');

  // Qidiruv formasining topshirilish hodisasiga quloq solish
  elSearchForm.on('submit', function (evt) {
    // Formaning tabiiy ishlash prinsipini o'chirish
    evt.preventDefault();
  
    // Qidirilayotgan kino nomini eslab qolish
    var movieName = $(this).find('.js-movie-search-input').val();

    // Qidiruv matnini ko'rsatish
    $('.js-search-word').text(movieName);

    // Internetga so'rov yuborish
    $.ajax('https://www.omdbapi.com/', {
      method: 'GET',
      data: {
        apikey: '249e8962',
        s: movieName
      },
      timeout: 10000,
      success: function (response) {
        if (response.Error) {
          alert(response.Error);
          return;
        }
        
        console.log(response);
      },
      error: function (request, errorType, errorMessage) {
        alert(`${errorType}: ${errorMessage}`);
      }
    });
  });
});