class AddProspectsFilesRefToProspects < ActiveRecord::Migration[6.1]
  def change
    add_column :prospects, :csv_id, :bigint
  end
end
