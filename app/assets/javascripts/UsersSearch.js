$.UsersSearch = function (el) {
  this.$el = $(el);
  this.$input = this.$el.children('input');
  this.$ul = this.$el.children('ul.users');
  this.$input.on('input', this.handleInput.bind(this));
};

$.UsersSearch.prototype.handleInput = function(){
  var that = this;
  $.ajax({
    url: "/users/search",
    type: "GET",
    dataType: "json",
    data: {query: this.$input.val()},

    success: function (response) {
      that.renderResults(response);
    }
  });
};

$.UsersSearch.prototype.renderResults = function (response) {
  this.$ul.empty();

  for (var i = 0; i < response.length; i++){
    var $li = $('<li></li>');
    var $a = $('<a></a>');
    $a.text(response[i].username);
    $a.attr('href', '/users/' + response[i].id);

    var $button = $('<button></button>');
    $button.addClass('follow-toggle');
    var followedStatus = (response[i].followed) ? "followed" : "unfollowed";
    var options = {
      userId: response[i].id,
      followState: followedStatus
    }
    $button.followToggle(options);

    $li.append($a);
    $li.append($button);
    this.$ul.append($li);
  };
};

$.fn.usersSearch = function () {
  return this.each(function () {
    new $.UsersSearch(this);
  });
};

$(function () {
  $("div.users-search").usersSearch();
});
