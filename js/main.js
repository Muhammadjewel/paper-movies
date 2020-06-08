var searchQuery = '';

$(document).ready(function () {
  // Natijalar ro'yxatini o'zgaruvchiga saqlab olish
  var elResultsList = $('.results__list');

  var showSearchResults = function (foundMovies) {
    var results = $.map(foundMovies, function (movie) {
      var movieElement = $(`
        <li class="results__item result col sm-6 md-4">
          <div class="result__card card">
            <div class="card-body">
              <h3 class="card-title margin-top-none">
                <span class="js-result-title"></span>
                <span class="js-result-year badge"></span>
              </h3>
              <label class="js-result-modal-opener col paper-btn btn btn-warning" for="movie-info-modal">Info</label>
            </div>
          </div>
        </li>
      `);

      movieElement.find('.js-result-title').text(movie.Title);
      movieElement.find('.js-result-year').text(movie.Year);
      movieElement.find('.js-result-modal-opener').attr('data-movie-id', movie.imdbID);

      return movieElement;
    });

    elResultsList.append(results);
  };

  // Qidiruv formasi va inputini eslab qolish
  var elSearchForm = $('.js-movie-search-form');
  var elSearchInput = elSearchForm.find('.js-movie-search-input');

  // Qidiruv formasining topshirilish hodisasiga quloq solish
  elSearchForm.on('submit', function (evt) {
    // Formaning tabiiy ishlash prinsipini o'chirish
    evt.preventDefault();
  
    // Qidirilayotgan kino nomini eslab qolish
    var movieName = elSearchInput.val();

    // Qidiruv matnini ko'rsatish
    $('.js-search-word').text(movieName);

    searchQuery = `https://omdbapi.com/?apiKey=249e8962&s=${movieName}`;

    // Internetga so'rov yuborish
    $.ajax('https://www.omdbapi.com/', {
      method: 'GET',
      data: {
        apikey: '249e8962',
        s: movieName
      },
      timeout: 10000,
      // yuborishdan oldin nima qilinadi
      beforeSend: function () {
        elResultsList.html('');
        elSearchInput.attr('disabled', true);
      },
      // javob qaytgandan keyin
      complete: function () {
        elSearchInput.attr('disabled', false);
      },
      // muvaffaqiyatli javob bo'lsa
      success: function (response) {
        // aytilgan nomdagi kino bo'lmasa
        if (response.Error) {
          alert(response.Error);
          return;
        }

        // kinolar topilsa, ko'rsatamiz
        showSearchResults(response.Search);
        
        // jami topilgan natijalarga ko'ra sahifalar sonini topish
        var pagesCount = Math.ceil(parseInt(response.totalResults, 10) / 10);

        $('.pagination').html('');

        for (var i = 1; i <= pagesCount; i++) {
          $('.pagination').append(`<button class="btn-warning margin-small" type="button" data-page="${i}" ${ i === 1 ? 'disabled' : '' }>${i}</button>`);
        }
      },
      error: function (request, errorType, errorMessage) {
        alert(`${errorType}: ${errorMessage}`);
      }
    });
  });


  var elModal = $('.modal');

  var resetModalInfo = function () {
    elModal.find('.js-modal-movie-poster').attr('src', '');
    elModal.find('.js-modal-movie-title').text('');
    elModal.find('.js-modal-movie-rating').text('');
    elModal.find('.js-modal-movie-genres').text('');
    elModal.find('.js-modal-movie-plot').text('');
  };

  var insertModalInfo = function (response) {
    elModal.find('.js-modal-movie-poster').attr('src', response.Poster);
    elModal.find('.js-modal-movie-title').text(response.Title);
    elModal.find('.js-modal-movie-rating').text(response.imdbRating);
    elModal.find('.js-modal-movie-genres').text(response.Genre);
    elModal.find('.js-modal-movie-plot').text(response.Plot);
  };

  // Natija labeli bosilganda modalda batafsil ma'lumotni ko'rsatish
  elResultsList.on('click', '.js-result-modal-opener', function () {
    var movieId = $(this).data('movie-id');

    $.ajax('https://omdbapi.com', {
      method: 'GET',
      data: {
        apikey: '249e8962',
        plot: 'full',
        i: movieId
      },
      timeout: 10000,
      beforeSend: resetModalInfo,
      success: insertModalInfo,
      error: function (request, errorType, errorMessage) {
        alert(`${errorType}: ${errorMessage}`);
      }
    });
  });

});