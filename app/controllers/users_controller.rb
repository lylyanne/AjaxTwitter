class UsersController < ApplicationController
  before_action :require_not_logged_in!, only: [:create, :new]
  before_action :require_logged_in!, only: [:show]

  def create
    @user = User.new(user_params)
    if @user.save
      log_in!(@user)
      redirect_to feed_url
    else
      render :new
    end
  end

  def new
    @user = User.new
    render :new
  end

  def show
    if current_user.nil?
      redirect_to new_session_url
      return
    end

    @user = User.find(params[:id])
    render :show
  end

  def search
    if params[:query].present?
      @users = User.where("username ~ ?", params[:query])
    else
      @users = User.none
    end

    respond_to do |format|
      format.html { render :search }
      format.json { render :search }
    end
  end

  protected
  def user_params
    self.params.require(:user).permit(:username, :password)
  end
end
