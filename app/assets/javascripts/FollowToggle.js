$.FollowToggle = function (el, options) {
  this.$el = $(el);
  this.userId = this.$el.attr("data-user-id") || options.userId;
  this.followState = this.$el.attr("data-follow-state") || options.followState;
  this.render();
  this.$el.on('click', this.handleClick.bind(this));
};

$.FollowToggle.prototype.render = function () {
  // ...
  if (this.followState === "followed") {
    this.$el.text("Unfollow");
  } else if (this.followState === "unfollowed") {
    this.$el.text("Follow!");
  } else if (this.followState === "following") {
    this.$el.text("following..");
  } else if (this.followState === "unfollowing") {
    this.$el.text("unfollowing..");
  };
};

$.FollowToggle.prototype.handleClick = function (event) {
  // ...
  event.preventDefault();
  var that = this;

  if (this.followState === "unfollowed") {
    this.followState = "following";
    this.$el.prop("disabled", true);
    this.render();
    $.ajax({
      url: "/users/" + this.userId + "/follow",
      type: "POST",
      dataType: "json",
      success: function () {
        that.followState = "followed";
        that.$el.prop("disabled", false);
        that.render();
      }
    });
  } else {
    this.followState = "unfollowing";
    this.$el.prop("disabled", true);
    this.render();
    $.ajax({
      url: "/users/" + this.userId + "/follow",
      type: "DELETE",
      dataType: "json",
      success: function () {
        that.followState = "unfollowed";
        that.$el.prop("disabled", false);
        that.render();
      }
    });
  }
};

$.fn.followToggle = function (options) {
  return this.each(function () {
    new $.FollowToggle(this, options);
  });
};

$(function () {
  $("button.follow-toggle").followToggle();
});
