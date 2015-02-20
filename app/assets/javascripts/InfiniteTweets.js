$.InfiniteTweets = function (el) {
  this.$el = $(el);
  this.maxCreatedAt = null;
  this.$el.on('click', 'a.fetch-more', this.fetchTweets.bind(this));
  this.$el.on('insert-tweet', this.insertTweet.bind(this));
};

$.InfiniteTweets.prototype.fetchTweets = function () {
  var that = this;

  var options = {
    url: "/feed",
    dataType: "json",
    success: function (response) {
      that.insertTweets(response);
    }
  }

  if (this.maxCreatedAt) {
    options.data = { max_created_at: this.maxCreatedAt };
  }

  $.ajax(options);
};

$.InfiniteTweets.prototype.insertTweet = function (event, response) {
  var templateCode = $("#tweet_template").html();
  var templateFn = _.template(templateCode);

  var renderedContent = templateFn({ tweets: [response] });
  this.$el.find('ul.tweets').prepend(renderedContent);

  if (!this.maxCreatedAt) {
    this.maxCreatedAt = response.created_at;
  }
};

$.InfiniteTweets.prototype.insertTweets = function (response) {
  var templateCode = $("#tweet_template").html();
  var templateFn = _.template(templateCode);

  var renderedContent = templateFn({ tweets: response });
  this.$el.find('ul.tweets').append(renderedContent);

  if (response.length < 20) {
    this.$el.find('.fetch-more').remove();
    this.$el.append('<p>No more feed to fetch</p>');
  }

  this.maxCreatedAt = response[response.length-1].created_at;
};

$.fn.InfiniteTweets = function () {
  return this.each(function () {
    new $.InfiniteTweets(this);
  });
};

$(function () {
  $("div.infinite-tweets").InfiniteTweets();
});
