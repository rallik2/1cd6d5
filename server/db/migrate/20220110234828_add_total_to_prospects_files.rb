class AddTotalToProspectsFiles < ActiveRecord::Migration[6.1]
  def change
    add_column :prospects_files, :csv_total_rows, :integer
  end
end
