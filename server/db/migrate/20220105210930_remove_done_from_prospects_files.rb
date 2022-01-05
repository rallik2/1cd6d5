class RemoveDoneFromProspectsFiles < ActiveRecord::Migration[6.1]
  def change
    remove_column :prospects_files, :done, :integer
  end
end
