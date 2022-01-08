class AddDefaultTimeStampToProspects < ActiveRecord::Migration[6.1]
  def change
    reversible do |dir|
      dir.up do
        change_column_default :prospects, :updated_at, -> { 'CURRENT_TIMESTAMP' }
        change_column_default :prospects, :created_at, -> { 'CURRENT_TIMESTAMP' }
      end

      dir.down do
        change_column_default :prospects, :updated_at, nil
        change_column_default :prospects, :created_at, nil
      end

    end  
  end
end
