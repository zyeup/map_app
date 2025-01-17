class Api::V1::MarkersController < ApplicationController
  before_action :set_marker, only: [:show, :update, :destroy]

  def index
    post_id = params[:post_id]
    @markers = Marker.where(post_id: post_id).order(:id)
    render json: @markers
  end

  def show
    render json: @marker.as_json.merge(image_url: @marker.image.url)
  end

  def create
    @marker = Marker.new(marker_params)

    if @marker.save
      render json: @marker.as_json.merge(image_url: @marker.image.url), status: :created
    else
      render json: @marker.errors, status: :unprocessable_entity
    end
  end

  def update
    if @marker.update(marker_params)
      render json: @marker
    else
      render json: @marker.errors, status: :unprocessable_entity
    end

  end

  def destroy
    @marker.destroy
  end

  private

  def set_marker
    @marker = Marker.find(params[:id])
  end

  def marker_params
    params.permit(:lat, :lng, :title, :content, :post_id, :image)
  end

end
