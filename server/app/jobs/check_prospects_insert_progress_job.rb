class CheckProspectsInsertProgressJob < ApplicationJob
  queue_as :default

  def perform(prospects_files_id)
    prospects_files = ProspectsFiles.find(prospects_files_id)
    total = prospects_files.total
    prospects_inserted_count = Prospect.where(csv_id: prospects_files.id).length
    return { total: total, done: prospects_inserted_count }
  end
end
