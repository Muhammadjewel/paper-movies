var searchQuery = '';
var currentPage = 1;

$(document).ready(function () {
  $('.js-movie-search-form').on('submit', function (evt) {
    evt.preventDefault();
    var elMovieSearchInput = $(this).find('.js-movie-search-input');
    var movieName = elMovieSearchInput.val();

    $.ajax('https://omdbapi.com', {
      method: 'GET',
      data: {
        apiKey: '249e8962',
        s: movieName
      },
      beforeSend: function () {
        searchQuery = `https://omdbapi.com?apiKey=249e8962&s=${movieName}`;
        elMovieSearchInput.attr('disabled', true);
        $('.results__list').html('');
        $('.pagination').html('');
      },
      complete: function () {
        elMovieSearchInput.attr('disabled', false);
      },
      success: function (response) {
        $('.js-search-word').text(movieName);

        if (response.Error) {
          alert(response.Error);
          return;
        }

        var results = $.map(response.Search, function (movie, index) {
          var movieItem = $(`
            <li class="results__item result col sm-6 md-4">
              <div class="result__card card">
                <div class="card-body">
                  <h3 class="card-title margin-top-none">
                    <span class="js-result-title"></span>
                    <span class="js-result-year badge"></span>
                  </h3>
                  <label class="js-result-modal-opener col paper-btn btn btn-warning btn-small" for="movie-info-modal">Info</label>
                </div>
              </div>
            </li>`);
          movieItem.find('.js-result-title').text(movie.Title);
          movieItem.find('.js-result-year').text(movie.Year);
          movieItem.find('label').attr('data-movie-id', movie.imdbID);
          return movieItem;
        });
        
        $('.results__list').detach().html(results).insertAfter('.results h2');

        var pagesCount = Math.ceil(parseInt(response.totalResults, 10) / 10);
        
        for (var i = 1; i <= pagesCount; i++) {
          $('.pagination').append('<button class="btn-primary btn-small margin-small" type="button" data-page="' + i + '">' + i + '</button>');
          if (i === currentPage) {
            console.log('shu')
          }
        }
      }
    });
  });

  $('.results__list').on('click', '.js-result-modal-opener', function () {
    var movieId = $(this).data('movie-id');
    
    $.ajax('https://omdbapi.com', {
      method: 'GET',
      data: {
        apiKey: '249e8962',
        i: movieId,
        plot: 'full'
      },
      success: function (response) {
        if (response.Poster) {
          $('.js-modal-movie-poster').attr('src', response.Poster);
        } else {
          $('.js-modal-movie-poster').attr('src', 'https://placehold.it/250x360');
        }
        $('.js-modal-movie-title').text(response.Title);
        $('.js-modal-movie-rating').text(response.imdbRating);
        $('.js-modal-movie-genres').text(response.Genre);
        $('.js-modal-movie-plot').text(response.Plot);
        console.log(response);
      }
    });
  });
});

$('.pagination').on('click', 'button', function () {
  $('.results__list').html('');
  $('.pagination').find('button').attr('disabled', false);
  currentPage = $(this).data('page');
  $(this).attr('disabled', true);
  var pageLink = searchQuery + '&page=' + currentPage;
  console.log(currentPage, pageLink);
});
