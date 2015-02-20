$.TweetCompose = function (el) {
  this.$el = $(el);
  this.$el.on('submit', this.submit.bind(this));
  this.$textArea = this.$el.find('textarea');
  this.$mentionedUsersDiv = this.$el.find('.mentioned-users');
  this.$textArea.on('input', this.charsRemaining.bind(this));
  this.$el.find('a.add-mentioned-user').on('click',
    this.addMentionedUser.bind(this));
  this.$mentionedUsersDiv.on('click', 'a.remove-mentioned-user',
    this.removeMentionedUser.bind(this));
  };

$.TweetCompose.prototype.charsRemaining = function(event){
  var currentLength = this.$textArea.val().length;
  var charsRemaining = 140 - currentLength;
  var $tag = this.$textArea.parent().find('strong');
  if (!$tag.length) {
    $tag = $('<strong></strong>');
    $tag.addClass('chars-left');
    this.$textArea.parent().append($tag);
  }
  $tag.text(charsRemaining + ' remaining characters');
};

$.TweetCompose.prototype.submit = function(event){
  event.preventDefault();
  var that = this;

  this.$el.data("tweets-ul", "#feed");
  var formData = this.$el.serializeJSON();
  this.$el.find(':input').prop("disabled", true);

  $.ajax({
    url: "/tweets/",
    type: "POST",
    dataType: "json",
    data: formData,
    success: function (response) {
      that.handleSuccess(response);
    }
  });
};

$.TweetCompose.prototype.clearInput = function () {
  this.$el.find(':input').not(':submit').val('');
};

$.TweetCompose.prototype.handleSuccess = function (response) {
  this.clearInput();
  this.$el.find('strong').remove();

  var $ul = $(this.$el.parent().find("ul.feed"));
  var $a = $('<a></a>');
  $a.text(response.user.username);
  $a.attr('href', '/users/' + response.user.id);
  var $li = $("<li></li>");
  $li.append(response.content + " -- ").append($a).append(" -- " +
  response.created_at);

  if (response.mentions) {
    var $innerul = $("<ul></ul>");
    var $innerli = $("<li></li>");
    var $a = $('<a></a>');
    $a.text(response.mentions[0].user.username);
    $a.attr('href', '/users/' + response.mentions[0].user_id);
    $innerli.append($a);
    $innerul.append($innerli);
  }

  $ul.prepend($li);
  $li.append($innerul);
  this.$el.find(':input').prop("disabled", false);
  this.$mentionedUsersDiv.empty();
};

$.TweetCompose.prototype.addMentionedUser = function () {
  var $scriptTag = this.$el.find('script');
  var $mentionedUsers = this.$el.find('.mentioned-users');
  $mentionedUsers.append($scriptTag.html());
};

$.TweetCompose.prototype.removeMentionedUser = function (event) {
  event.preventDefault();
  $(event.currentTarget).parent().remove();
};

$.fn.tweetCompose = function () {
  return this.each(function () {
    new $.TweetCompose(this);
  });
};

$(function () {
  $("form.tweet-compose").tweetCompose();
});
