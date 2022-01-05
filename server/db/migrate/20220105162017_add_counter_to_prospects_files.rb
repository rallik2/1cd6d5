class AddCounterToProspectsFiles < ActiveRecord::Migration[6.1]
  def change
    add_column :prospects_files, :total, :integer
    add_column :prospects_files, :done, :integer
  end
end
