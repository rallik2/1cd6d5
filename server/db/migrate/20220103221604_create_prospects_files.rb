class CreateProspectsFiles < ActiveRecord::Migration[6.1]
  def change
    create_table :prospects_files do |t|

      t.timestamps
    end
  end
end
