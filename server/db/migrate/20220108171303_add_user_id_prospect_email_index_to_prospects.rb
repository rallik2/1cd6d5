class AddUserIdProspectEmailIndexToProspects < ActiveRecord::Migration[6.1]
  def change
    add_index :prospects, [:email, :user_id], :unique => true
  end
end
