class CreateLocations < ActiveRecord::Migration[7.0]
  def change
    create_table :locations do |t|
      t.string :country
      t.string :prefecture
      t.string :city

      t.timestamps
    end
  end
end
